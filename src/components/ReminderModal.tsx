"use client";

import { IReminder } from "@/types/reminder-interface";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  reminders?: IReminder[];
  onReminderAdd: (date: Date, text: string) => void;
  onReminderDelete?: (id: string) => void;
  onReminderUpdate?: (reminder: IReminder) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  date,
  reminders,
  onReminderAdd,
  onReminderDelete,
  onReminderUpdate,
}) => {
  const [reminderText, setReminderText] = useState("");
  const [remindersData, setRemindersData] = useState(reminders || []);
  const [updateReminder, setUpdateReminder] = useState<IReminder | null>(null);

  useEffect(() => {
    if (reminders) {
      setRemindersData(reminders!);
    }
  }, [reminders]);

  const handleAddReminder = () => {
    if (date && reminderText) {
      onReminderAdd(date, reminderText);
      setReminderText("");
      onClose();
    }
  };

  const handleUpdateReminder = () => {
    if (updateReminder) {
      onReminderUpdate!(updateReminder);
      setUpdateReminder(null);
      onClose();
    }
  };

  const handleRemoveReminder = (reminderId: string) => {
    if (reminderId) {
      setRemindersData(
        remindersData.filter((reminder) => reminder._id !== reminderId)
      );
      onReminderDelete!(reminderId);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="modal-container">
        <div
          className="modal-content w-fit rounded-lg p-6 bg-white dark:bg-slate-950 border-2
        border-black dark:border-white shadow-lg shadow-slate-500 dark:shadow-slate-700"
        >
          {/* Existing Reminders */}
          {remindersData && remindersData.length > 0 && (
            <div className="w-full flex flex-col justify-center items-start mb-3 gap-2">
              <h3 className="text-lg font-semibold">
                Existing Reminders on {format(date!, "dd/MM/yyyy")}
              </h3>
              {remindersData.map((reminder) => {
                return (
                  <span
                    key={reminder._id}
                    className="w-[85vw] md:w-[50vw] lg:w-[30vw] flex p-2 justify-between items-center rounded-md
                    bg-gradient-to-br from-[#00416A] to-[#E4E5E6] text-black"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        reminder.isDone ? "bg-green-600" : "bg-red-600"
                      }`}
                      title={`${
                        reminder.isDone ? "Completed" : "Not Completed"
                      }`}
                    />
                    <p className="w-[74%] text-sm text-white">
                      {reminder.reminderText}
                    </p>
                    <span
                      className={`w-[20%] flex ${
                        reminder.isDone ? "justify-end pr-3" : "justify-evenly"
                      } items-center`}
                    >
                      {!reminder.isDone && (
                        <FaEdit
                          className="cursor-pointer"
                          title="Edit Reminder"
                          onClick={() => setUpdateReminder(reminder)}
                        />
                      )}
                      <AiFillDelete
                        className="cursor-pointer"
                        title="Delete Reminder"
                        onClick={() => handleRemoveReminder(reminder._id!)}
                      />
                    </span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Add Reminder */}
          <h2 className="text-xl font-semibold mb-4">
            {!updateReminder ? "Add" : "Update"} Reminder{" "}
            {date && `on ${format(date, "dd/MM/yyyy")}`}
          </h2>
          <input
            type="text"
            placeholder="Enter reminder text"
            className="bg-white dark:bg-gray-600 border border-gray-300 rounded-md px-4 py-2
            w-full mb-4 focus:outline-none focus:border-blue-500"
            value={updateReminder ? updateReminder.reminderText : reminderText}
            onChange={(e) => {
              updateReminder
                ? setUpdateReminder({
                    ...updateReminder,
                    reminderText: e.target.value,
                  })
                : setReminderText(e.target.value);
            }}
          />
          <div className="flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mr-2"
              onClick={
                updateReminder ? handleUpdateReminder : handleAddReminder
              }
            >
              {updateReminder ? "Update" : "Add"}
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
              onClick={() => {
                setUpdateReminder(null);
                setReminderText("");
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
