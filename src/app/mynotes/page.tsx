"use client";

import CreateNoteModal from "@/components/CreateNoteModal";
import MainScreenLoader from "@/components/MainScreenLoader";
import NavBar from "@/components/NavBar";
import NoteCard from "@/components/NoteCard";
import PasswordChangeModal from "@/components/PasswordChangeModal";
import { useWindowScrollPositions } from "@/helpers/useWindowScrollPositions";
import { NoteInterface } from "@/types/note-interface";
import { UserInterface } from "@/types/user-interface";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

function MyNotesPage() {
  const router = useRouter();
  const [toastError, setToastError] = useState<string>("");
  const [toastSuccess, setToastSuccess] = useState<string>("");
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInterface>();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<NoteInterface[]>([]);
  const [editNote, setEditNote] = useState<NoteInterface | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { scrollY } = useWindowScrollPositions();

  // ---- useEffects Region Start ---- //
  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    getMyNotes();
  }, [user]);

  useEffect(() => {
    if (toastError.length) {
      toast.error(toastError);
    }

    return () => {
      setToastError("");
    };
  }, [toastError]);

  useEffect(() => {
    if (toastSuccess.length) {
      toast.success(toastSuccess);
    }

    return () => {
      setToastSuccess("");
    };
  }, [toastSuccess]);

  // ---- useEffects Region End ---- //

  // ---- Handler Functions & API Calls ---- //
  const getUserDetails = async () => {
    try {
      const response = await axios.post("/api/auth/authuser");
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      router.push("/login");
    }
  };

  const getMyNotes = async () => {
    if (user) {
      try {
        const response = await axios.post("/api/notes/fetch", {
          createdBy: user.username,
        });
        if (response.data.success) {
          let notesArr: NoteInterface[] = response.data.resultObject;
          notesArr = notesArr.reverse();
          setNotes(notesArr);
        } else {
          setUserLoading(false);
          setToastError("Error fetching notes");
        }
      } catch (error) {
        setUserLoading(false);
        setToastError("Error fetching notes");
      } finally {
        setUserLoading(false);
      }
    }
  };

  const handleSigningOut = async () => {
    setUserLoading(true);
    try {
      const response = await axios.post("api/auth/signout");
      if (response.data.success) {
        router.push("/login");
      } else {
        toast.error("Error occured while signing out");
      }
    } catch (error) {
      toast.error("Error occured while signing out");
    }
  };

  const onNoteSave = (newlyAddedNote: NoteInterface) => {
    setCreateModalOpen(false);
    setToastSuccess("Note Saved !");
    setEditNote(null);

    let newNotes = [...notes];
    const ifExists = newNotes.find((note) => note._id === newlyAddedNote._id);
    if (ifExists) {
      newNotes.splice(newNotes.indexOf(ifExists), 1, newlyAddedNote);
    } else {
      newNotes.unshift(newlyAddedNote);
    }
    setNotes(newNotes);
  };

  const onEditNote = (note: NoteInterface) => {
    setEditNote(note);
    setCreateModalOpen(true);
  };

  const onDeleteNote = async (noteId: string) => {
    setIsDeleting(true);
    setCreateModalOpen(true);

    try {
      const response = await axios.post("/api/notes/delete", { _id: noteId });

      if (response.data.success) {
        setIsDeleting(false);
        setCreateModalOpen(false);

        const updatedNotes = notes.filter((note) => note._id !== noteId);
        setNotes(updatedNotes);

        setToastSuccess("Note deleted !");
      } else {
        setIsDeleting(false);
        setCreateModalOpen(false);
        setToastError("Error deleting note !");
      }
    } catch (error) {
      setCreateModalOpen(false);
      setIsDeleting(false);
      setToastError("Error deleting note !");
    }
  };

  // ---- Handler Functions & API Calls End ---- //

  return !userLoading && user ? (
    <div
      className={`w-full h-full min-h-screen bg-gradient-to-b from-slate-500 to-slate-800 ${
        createModalOpen && "fixed"
      }`}
    >
      <NavBar
        user={user!}
        onPasswordChange={() => setPasswordModalOpen(true)}
        isSigningOut={handleSigningOut}
      />

      {/* Create Button for Other Devices */}
      <div className="w-full hidden md:flex justify-center items-center sticky top-2 mt-4">
        <button
          className={`z-20 flex flex-col justify-center items-center h-24 w-24 rounded-md bg-white ${
            scrollY > 100 && "shadow-lg shadow-slate-400"
          }`}
          onClick={() => setCreateModalOpen(true)}
        >
          <FaPlus className="h-10 w-10" />
          <h5 className="mt-1 font-bold">Create</h5>
        </button>
      </div>

      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSave={() => {
          setPasswordModalOpen(false);
          setToastSuccess("Password updated !");
        }}
        username={user.username!}
      />

      <CreateNoteModal
        editNote={editNote}
        isDeleting={isDeleting}
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditNote(null);
        }}
        onSave={onNoteSave}
        username={user.username!}
      />

      {/* Cards Container */}
      <div
        className={`w-full p-6 flex flex-col flex-wrap md:flex-row justify-center items-center md:justify-evenly gap-4`}
      >
        <Toaster />

        {/* Notes Cards */}
        {notes.map((note) => {
          return (
            <NoteCard
              key={note._id}
              onDeleteNote={onDeleteNote}
              onEditNote={onEditNote}
              note={note}
            />
          );
        })}
      </div>

      {/* Create Button Only for mobile devices */}
      <button
        className="z-20 fixed md:hidden h-14 w-14 right-6 bottom-6 bg-slate-900 shadow-md rounded-full text-white"
        onClick={() => setCreateModalOpen(true)}
      >
        <FaPlus className="h-10 w-10 ml-2" />
      </button>
    </div>
  ) : (
    <MainScreenLoader />
  );
}

export default MyNotesPage;
