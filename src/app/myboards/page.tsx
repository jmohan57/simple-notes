"use client";

import MainScreenLoader from "@/components/MainScreenLoader";
import BoardCard from "@/components/MyBoards/BoardCard";
import CreateBoardModal from "@/components/MyBoards/CreateBoardModal";
import NavBar from "@/components/NavBar";
import PasswordChangeModal from "@/components/PasswordChangeModal";
import { useWindowScrollPositions } from "@/helpers/useWindowScrollPositions";
import { IBoard } from "@/types/board-interface";
import { UserInterface } from "@/types/user-interface";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

function MyBoardsPage() {
  const router = useRouter();
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInterface>();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [editBoard, setEditBoard] = useState<IBoard | null>(null);
  const [toastError, setToastError] = useState<string>("");
  const [toastSuccess, setToastSuccess] = useState<string>("");
  const { scrollY } = useWindowScrollPositions();

  // ---- useEffects Region Start ---- //
  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    getMyBoards();
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

  const getMyBoards = async () => {
    if (user) {
      try {
        const response = await axios.post("/api/boards/fetch", {
          createdBy: user.username,
        });
        if (response.data.success) {
          let boardsArr: IBoard[] = response.data.resultObject;
          const pinnedBoards = boardsArr.filter((board) => board.pinned);
          const unpinnedBoards = boardsArr.filter((board) => !board.pinned);

          setBoards([...pinnedBoards, ...unpinnedBoards]);
        } else {
          setUserLoading(false);
          setToastError("Error fetching boards");
        }
      } catch (error) {
        setUserLoading(false);
        setToastError("Error fetching boards");
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

  const handleBoardSave = (newlyAddedBoard: IBoard) => {
    setCreateModalOpen(false);
    setToastSuccess("Board Saved !");
    setEditBoard(null);

    let newBoards = [...boards];
    const ifExists = newBoards.find(
      (board) => board._id === newlyAddedBoard._id
    );
    if (ifExists) {
      newBoards.splice(newBoards.indexOf(ifExists), 1, newlyAddedBoard);
    } else {
      const pinnedBoards = newBoards.filter((board) => board.pinned);
      const unpinnedBoards = newBoards.filter((board) => !board.pinned);
      unpinnedBoards.unshift(newlyAddedBoard);
      newBoards = [...pinnedBoards, ...unpinnedBoards];
    }
    setBoards(newBoards);
  };

  const handleTogglePin = async (changedValue: boolean, boardId: string) => {
    let updatedBoard: IBoard = boards.find((board) => board._id === boardId)!;

    const newBoardsArray = [...boards];
    newBoardsArray.splice(newBoardsArray.indexOf(updatedBoard!), 1);

    updatedBoard = { ...updatedBoard, pinned: changedValue };

    const pinnedBoards = newBoardsArray.filter((board) => board.pinned);
    const unpinnedBoards = newBoardsArray.filter((board) => !board.pinned);
    if (changedValue) {
      pinnedBoards.unshift(updatedBoard);
    } else {
      unpinnedBoards.unshift(updatedBoard);
    }
    setBoards([...pinnedBoards, ...unpinnedBoards]);

    try {
      const response = await axios.post("/api/boards/pintoggle", {
        pinned: changedValue,
        _id: boardId,
      });
      if (response.data.success) {
        setToastSuccess(
          `${changedValue ? "Board pinned to top !" : "Board unpinned !"}`
        );
      } else {
        setToastError(response.data.error + " Operation could not be saved !");
      }
    } catch (error) {
      setToastError("Something went wrong, operation could not be saved !");
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
        switchPageOption={{ title: "My Notes", path: "/mynotes" }}
      />

      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSave={() => {
          setPasswordModalOpen(false);
          setToastSuccess("Password updated !");
        }}
        username={user.username!}
      />

      <CreateBoardModal
        editBoard={null}
        isDeleting={false}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleBoardSave}
        username={user.username!}
      />

      {/* Create Button for Other Devices */}
      <div className="w-full hidden md:flex justify-center items-center sticky top-2 mt-4">
        <button
          className={`z-20 flex flex-col justify-center items-center h-24 w-24 rounded-md bg-white dark:bg-slate-800 ${
            scrollY > 100 && "shadow-lg shadow-slate-400"
          }`}
          onClick={() => setCreateModalOpen(true)}
        >
          <FaPlus className="h-10 w-10" />
          <h5 className="mt-1 font-bold">Create</h5>
        </button>
      </div>

      {/* Cards Container */}
      <div
        className={`w-full p-6 flex flex-col flex-wrap md:flex-row justify-center items-center md:justify-evenly gap-4`}
      >
        <Toaster />

        {/* Boards Cards */}
        {boards.map((board) => {
          return <BoardCard boardData={board} onTogglePin={handleTogglePin} />;
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

export default MyBoardsPage;
