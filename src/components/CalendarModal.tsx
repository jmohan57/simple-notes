"use client";

import CalendarContent from "@/components/CalendarContent";
import { IReminder } from "@/types/reminder-interface";
import axios from "axios";
import { addMonths, format, subMonths } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineClose,
} from "react-icons/ai";
import { toast } from "react-toastify";

interface CalendarModalProps {
  reminders: IReminder[];
  username: string;
  onUpdateReminder: (reminders: IReminder[]) => void;
  isOpen: boolean;
  onClose: () => void;
  relatedTaskId?: string | undefined;
}

const CalendarModal: React.FC<CalendarModalProps> = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState(props.reminders || []);

  useEffect(() => {
    setReminders(props.reminders);
  }, [props]);

  if (!props.isOpen) return null;

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date()); // Set current date to today
  };

  const handleReminderAdd = async (date: Date, text: string) => {
    try {
      const response = await axios.post("/api/reminder/add", {
        reminderText: text,
        reminderDate: format(date, "dd/MM/yyyy"),
        relatedTaskId: props.relatedTaskId ?? "",
        createdBy: props.username,
      });
      if (response.data.success) {
        toast.success("Reminder added successfully !");
        let updatedReminders = reminders;
        console.log(response.data.resultObject);
        updatedReminders.push(response.data.resultObject);
        console.log(updatedReminders);
        setReminders(updatedReminders);
        props.onUpdateReminder(updatedReminders);
      } else {
        toast.error("Error adding reminder !");
      }
    } catch (error) {
      toast.error("Error adding reminder !");
    }
  };

  const handleReminderUpdate = async (updatedReminder: IReminder) => {
    try {
      const response = await axios.post(
        "/api/reminder/update",
        updatedReminder
      );
      if (response.data.success) {
        toast.success("Reminder updated successfully !");
        const index = reminders.indexOf(
          reminders.find((reminder) => reminder._id === updatedReminder._id)!
        );

        let updatedReminders = [...reminders];
        updatedReminders.splice(index, 1, updatedReminder);

        setReminders(updatedReminders);
        props.onUpdateReminder(updatedReminders);
      } else {
        toast.error("Error updating reminder !");
      }
    } catch (error) {
      toast.error("Error updating reminder !");
    }
  };

  const handleReminderDelete = async (id: string) => {
    try {
      const response = await axios.post("/api/reminder/delete", {
        _id: id,
      });
      if (response.data.success) {
        toast.success("Reminder removed successfully !");
        const updatedReminders = reminders.filter(
          (reminder) => reminder._id !== id
        );
        setReminders(updatedReminders);
        props.onUpdateReminder(updatedReminders);
      } else {
        toast.error("Error deleting reminder !");
      }
    } catch (error) {
      toast.error("Error deleting reminder !");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-70"></div> {/* Backdrop */}
      <div className="modal-container relative rounded-lg bg-white dark:bg-slate-900 p-4">
        <button
          className="absolute top-2 right-2 text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-400"
          onClick={props.onClose}
        >
          <AiOutlineClose className="h-6 w-6" />
        </button>
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">My Calendar</h2>
          <span className="w-full flex justify-between items-center">
            <button
              className="mb-2 bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded text-white"
              onClick={prevMonth}
            >
              <AiOutlineArrowLeft className="h-5 w-5" />
            </button>
            <button
              className="mb-2 bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded text-white"
              onClick={goToToday}
            >
              Today
            </button>
            <button
              className="mb-2 bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded text-white"
              onClick={nextMonth}
            >
              <AiOutlineArrowRight className="h-5 w-5" />
            </button>
          </span>

          <CalendarContent
            date={currentDate}
            reminders={reminders}
            onAddReminder={handleReminderAdd}
            onDeleteReminder={handleReminderDelete}
            onUpdateReminder={handleReminderUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
