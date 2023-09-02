import { IReminder } from "@/types/reminder-interface";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

function ReminderNotification({
  reminder,
  onUpdate,
}: {
  reminder: IReminder;
  onUpdate: (reminder: IReminder) => void;
}) {
  const handleReminderComplete = async () => {
    onUpdate({
      ...reminder,
      isDone: true,
    });
  };

  return (
    <span className="flex justify-between items-center ">
      <span className="w-[60%] mr-2 flex flex-col gap-1 justify-start text-left text-black items-center">
        <h1>
          <b>Reminder for Today</b>
        </h1>
        {reminder.reminderText}
      </span>
      <button
        className="p-2 bg-green-600 text-white w-[30%]"
        onClick={handleReminderComplete}
      >
        Done
      </button>
    </span>
  );
}

export default ReminderNotification;
