"use client";

import CalendarModal from "@/components/CalendarModal";
import ReminderNotification from "@/components/ReminderNotification";
import MainScreenLoader from "@/components/MainScreenLoader";
import DeleteModal from "@/components/MyBoards/DeleteModal";
import BoardLists from "@/components/MyBoards/BoardLists";
import NavBar from "@/components/NavBar";
import PasswordChangeModal from "@/components/PasswordChangeModal";
import { boardBgColors } from "@/helpers/colorArray";
import { AddListItem } from "@/types/add-list-item-enum";
import { IBoard } from "@/types/board-interface";
import { IReminder } from "@/types/reminder-interface";
import { UserInterface } from "@/types/user-interface";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [calendarModalOpen, setCalendarModalOpen] = useState<boolean>(false);
  const [reminders, setReminders] = useState<IReminder[]>();
  const [currentReminderToasts, setCurrentReminderToasts] = useState<
    IReminder[]
  >([]);

  // ---- useEffects Region Start ---- //
  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    getBoardData();
  }, [user, boardId]);

  useEffect(() => {
    // Check and show today's reminders
    if (reminders) {
      const todaysReminders = reminders.filter(
        (reminder) =>
          reminder.reminderDate === format(new Date(), "dd/MM/yyyy") &&
          reminder.isDone === false
      );

      if (currentReminderToasts !== todaysReminders) {
        let removeToastIds: (string | undefined)[] = [];
        currentReminderToasts.forEach((reminder) => {
          if (todaysReminders.find((r) => r._id === reminder._id)) {
            return;
          } else {
            removeToastIds.push(reminder._id);
          }
        });
        removeToastIds.map((id) => toast.dismiss(id));

        setCurrentReminderToasts(todaysReminders);
        todaysReminders.length &&
          todaysReminders.map((reminder) => {
            return toast(
              <ReminderNotification
                reminder={reminder}
                onUpdate={(reminder: IReminder) =>
                  handleUpdateReminders(reminder)
                }
              />,
              {
                autoClose: false,
                toastId: reminder._id,
              }
            );
          });
      }
    }
  }, [reminders]);

  // ---- useEffects Region End ---- //

  // ---- Handler Functions & API Calls ---- //
  const getUserDetails = async () => {
    try {
      const response = await axios.post("/api/auth/authuser");
      if (response.data.success) {
        setUser(response.data.data);
        setReminders(response.data.reminders);
        setUserLoading(false);
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      router.push("/login");
    }
  };

  const handleUpdateReminders = (reminder: IReminder) => {
    updateReminders(reminder);
  };

  const updateReminders = async (updatedReminder: IReminder) => {
    try {
      const response = await axios.post(
        "/api/reminder/update",
        updatedReminder
      );

      if (response.data.success) {
        toast.success("Reminder marked as Completed !");

        let currentReminders = [...reminders!];
        const index = currentReminders.indexOf(
          currentReminders.find(
            (reminder) => reminder._id === updatedReminder._id
          )!
        );
        currentReminders.splice(index, 1, updatedReminder);
        setReminders(currentReminders);
      } else {
        toast.error("Error occurred while marking reminder as completed !");
      }
    } catch (error) {
      toast.error("Error occurred while marking reminder as completed !");
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
      <ToastContainer position="top-center" />
      <NavBar
        user={user!}
        onCalendarOpen={() => setCalendarModalOpen(true)}
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

      <CalendarModal
        reminders={reminders!}
        username={user.username!}
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        onUpdateReminder={(updatedReminders: IReminder[]) =>
          setReminders([...updatedReminders])
        }
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
        {/* Boards Name and Other Options */}
        <div className="h-12 w-full sm:text-lg md:text-xl bg-black bg-opacity-60 text-white flex justify-between items-center p-2 md:p-6">
          <span className="font-bold gap-2 flex items-center">
            <input
              type="text"
              className={`rounded-md px-1 w-[60%] ${
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
                  : boardData.boardName.length > 12
                  ? boardData.boardName.slice(0, 12) + " ..."
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
              className="cursor-pointer w-6 h-6"
              onClick={() => setDeleteModalOpen(true)}
            />
          </span>
        </div>

        {/* Board main work area with Lists and Tasks */}
        <BoardLists
          boardData={boardData}
          reminders={reminders ?? []}
          onUpdateReminder={(updatedReminders: IReminder[]) =>
            setReminders(updatedReminders)
          }
        />
      </div>
    </div>
  ) : (
    <MainScreenLoader />
  );
}

export default ViewBoardPage;
