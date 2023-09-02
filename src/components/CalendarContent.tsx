"use client";

import ReminderModal from "@/components/ReminderModal";
import React, { useEffect, useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
} from "date-fns";
import { IReminder } from "@/types/reminder-interface";

interface CalendarContentProps {
  date: Date;
  reminders: IReminder[];
  onAddReminder: (date: Date, reminderText: string) => void;
  onDeleteReminder?: (reminderId: string) => void;
  onUpdateReminder?: (reminder: IReminder) => void;
}

const CalendarContent: React.FC<CalendarContentProps> = ({
  date,
  reminders,
  onAddReminder,
  onDeleteReminder,
  onUpdateReminder,
}) => {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfMonth(date);
  const currentDate = new Date();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderOnSelection, setReminderOnSelection] = useState<IReminder[]>(
    []
  );
  const [remindersData, setRemindersData] = useState<IReminder[]>();

  useEffect(() => {
    setRemindersData(reminders);
  }, [reminders]);

  const days = [];
  let day = start;

  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  const isSameDayFn = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthName = format(date, "MMMM yyyy");

  const handleDayClick = (clickedDate: Date) => {
    setSelectedDate(clickedDate);

    const remindersOnSelection = remindersData
      ? remindersData.filter(
          (reminder) =>
            reminder.reminderDate === format(clickedDate, "dd/MM/yyyy")
        )
      : [];
    setReminderOnSelection(remindersOnSelection);
    setReminderModalOpen(true);
  };

  const doesHaveReminder = (day: Date) => {
    return (
      remindersData &&
      remindersData.find(
        (reminder) => reminder.reminderDate === format(day, "dd/MM/yyyy")
      )
    );
  };

  return (
    <div className="text-black dark:text-white">
      <div className="text-center text-lg font-semibold mb-4">{monthName}</div>
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((dayName) => (
          <div key={dayName} className="p-2 text-center font-semibold">
            {dayName}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`p-2 text-center cursor-pointer rounded-md ${
              isSameMonth(day, date) ? "" : "text-gray-400"
            } ${isSameDayFn(day, currentDate) ? "bg-blue-300 dark:bg-blue-600" : ""}
            ${doesHaveReminder(day) ? "border-2 border-red-600" : ""}
            `}
            onClick={() => handleDayClick(day)}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setReminderOnSelection([]);
          setReminderModalOpen(false);
        }}
        date={selectedDate}
        reminders={reminderOnSelection}
        onReminderAdd={(date, text) => {
          setReminderModalOpen(false);
          onAddReminder(date, text);
        }}
        onReminderDelete={(id) => onDeleteReminder!(id)}
        onReminderUpdate={(reminder: IReminder) => onUpdateReminder!(reminder)}
      />
    </div>
  );
};

export default CalendarContent;
