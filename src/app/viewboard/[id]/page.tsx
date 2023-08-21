"use client";

import MainScreenLoader from "@/components/MainScreenLoader";
import DeleteModal from "@/components/MyBoards/DeleteModal";
import BoardLists from "@/components/MyBoards/BoardLists";
import NavBar from "@/components/NavBar";
import PasswordChangeModal from "@/components/PasswordChangeModal";
import { boardBgColors } from "@/helpers/colorArray";
import { IBoard } from "@/types/board-interface";
import { UserInterface } from "@/types/user-interface";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { AddListItem } from "@/types/add-list-item-enum";

function ViewBoardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const boardId = params.id;
  const [boardData, setBoardData] = useState<IBoard>();
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface>();
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);

  // ---- useEffects Region Start ---- //
  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    getBoardData();
  }, [user, boardId]);

  // ---- useEffects Region End ---- //

  // ---- Handler Functions & API Calls ---- //
  const getUserDetails = async () => {
    try {
      const response = await axios.post(`/../api/auth/authuser`);
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      router.push("/login");
    }
  };

  const getBoardData = async () => {
    if (boardId && user) {
      try {
        const response = await axios.post("/../api/boards/getboarddata", {
          createdBy: user.username,
          _id: boardId,
        });

        if (response.data.success) {
          setBoardData(response.data.resultObject);
        } else {
          router.push("/myboards");
        }
      } catch (error) {
        router.push("/myboards");
      } finally {
        setUserLoading(false);
      }
    }
  };

  const handleSigningOut = async () => {
    setUserLoading(true);
    try {
      const response = await axios.post("/../api/auth/signout");
      if (response.data.success) {
        router.push("/login");
      } else {
        toast.error("Error occured while signing out");
      }
    } catch (error) {
      toast.error("Error occured while signing out");
    }
  };

  const updateBoardDataOnDB = async (updatedData: IBoard) => {
    try {
      const response = await axios.post("/../api/boards/edit", updatedData);

      if (response.data.success) {
        setBoardData(response.data.resultObject);
      } else {
        toast.error("Error occured while saving board details");
      }
    } catch (error) {
      toast.error("Error occured while saving board details");
    }
  };

  const onChangeName = async () => {
    setInputError(false);
    if (boardData!.boardName.trim().length > 0) {
      setIsEditingName(false);
      updateBoardDataOnDB({
        ...(boardData as IBoard),
        boardName: boardData!.boardName.trim(),
      });
    } else {
      setInputError(true);
    }
  };

  const handleBackgroundChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setInputError(false);
    if (boardData!.boardName.trim().length > 0) {
      setBoardData({
        ...(boardData as IBoard),
        boardBackground: e.target.value,
      });
      updateBoardDataOnDB({
        ...(boardData as IBoard),
        boardBackground: e.target.value,
      });
    } else {
      setInputError(true);
    }
  };

  // ---- Handler Functions & API Calls End ---- //

  return !userLoading && user && boardData ? (
    <div
      className={`w-full min-h-screen bg-gradient-to-b from-slate-500 to-slate-800`}
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
          toast.success("Password updated !");
        }}
        username={user.username!}
      />

      <DeleteModal
        boardId={boardId}
        delete={AddListItem.Board}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />

      {/* Board Container */}
      <div
        className={`w-full bg-repeat ${boardData.boardBackground} opacity-70 flex flex-col items-start`}
      >
        <Toaster />

        {/* Boards Name and Other Options */}
        <div className="h-12 w-full sm:text-lg md:text-xl bg-black bg-opacity-60 text-white flex justify-between items-center p-2 md:p-6">
          <span className="font-bold gap-2 flex items-center">
            <input
              type="text"
              className={`rounded-md px-1 ${
                isEditingName ? "bg-white text-black" : "bg-transparent"
              } outline-none ${!isEditingName && "cursor-pointer"} ${
                inputError && "border-2 border-red-600"
              }`}
              title={boardData.boardName}
              onClick={() => setIsEditingName(true)}
              onChange={(e) => {
                isEditingName &&
                  setBoardData({ ...boardData, boardName: e.target.value });
              }}
              value={
                isEditingName
                  ? boardData.boardName
                  : boardData.boardName.length > 25
                  ? boardData.boardName.slice(0, 25) + " ..."
                  : boardData.boardName
              }
            />
            {isEditingName && (
              <FaCheck
                className="ml-2 cursor-pointer"
                title="Edit Board Name"
                onClick={onChangeName}
              />
            )}
          </span>
          <span className="flex gap-8 mr-4 justify-evenly items-center">
            <select
              className="text-sm md:text-base text-black p-1 rounded-md cursor-pointer"
              title="Change Background"
              onChange={handleBackgroundChange}
            >
              {boardBgColors.map((color) => {
                return (
                  <option
                    key={color.name}
                    value={color.color}
                    selected={color.color === boardData.boardBackground}
                  >
                    {color.name}
                  </option>
                );
              })}
            </select>
            <AiFillDelete
              title="Delete Board"
              className="cursor-pointer"
              onClick={() => setDeleteModalOpen(true)}
            />
          </span>
        </div>

        {/* Board main work area with Lists and Tasks */}
        <BoardLists boardData={boardData} />
      </div>
    </div>
  ) : (
    <MainScreenLoader />
  );
}

export default ViewBoardPage;
