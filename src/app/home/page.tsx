"use client";

import AppCard from "@/components/AppCard";
import CalendarModal from "@/components/CalendarModal";
import MainScreenLoader from "@/components/MainScreenLoader";
import NavBar from "@/components/NavBar";
import PasswordChangeModal from "@/components/PasswordChangeModal";
import ReminderNotification from "@/components/ReminderNotification";
import { appCards } from "@/helpers/appCards";
import { IReminder } from "@/types/reminder-interface";
import { UserInterface } from "@/types/user-interface";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const router = useRouter();
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInterface>();
  const [calendarModalOpen, setCalendarModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [toastError, setToastError] = useState<string>("");
  const [toastSuccess, setToastSuccess] = useState<string>("");
  const [reminders, setReminders] = useState<IReminder[]>();
  const [currentReminderToasts, setCurrentReminderToasts] = useState<
    IReminder[]
  >([]);
  // ---- useEffects Region Start ---- //
  useEffect(() => {
    getUserDetails();
  }, []);

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

        let currentReminders = reminders!;
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

  // ---- Handler Functions & API Calls End ---- //

  return !userLoading && user ? (
    <div
      className={`w-full h-full min-h-screen bg-gradient-to-b from-slate-500 to-slate-800`}
    >
      <ToastContainer position="top-center" />
      <NavBar
        user={user!}
        onCalendarOpen={() => setCalendarModalOpen(true)}
        onPasswordChange={() => setPasswordModalOpen(true)}
        isSigningOut={handleSigningOut}
      />

      <CalendarModal
        reminders={reminders!}
        username={user.username!}
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        onUpdateReminder={(updatedReminders: IReminder[]) => {
          setReminders([...updatedReminders]);
        }}
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

      {/* Cards Container */}
      <div
        className={`w-full p-6 flex flex-col flex-wrap md:flex-row justify-center items-center md:justify-evenly gap-4`}
      >
        {/* App Cards */}
        {appCards.map((card, i) => {
          return (
            <AppCard
              key={i}
              title={card.title}
              description={card.description}
              path={card.path}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <MainScreenLoader />
  );
}

export default HomePage;
