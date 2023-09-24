export const formatDateTime = (date: string | Date): string => {
  const today = new Date();
  const noteDate = typeof date === "string" ? new Date(date) : date;
  const lastEditedOnTime = noteDate.toLocaleString("en-US", {
    timeStyle: "short",
  });

  const isToday = (): boolean => {
    return (
      today.getDate() === noteDate.getDate() &&
      today.getMonth() === noteDate.getMonth() &&
      today.getFullYear() === noteDate.getFullYear()
    );
  };

  const isYesterday = (): boolean => {
    return (
      today.getDate() - 1 === noteDate.getDate() &&
      today.getMonth() === noteDate.getMonth() &&
      today.getFullYear() === noteDate.getFullYear()
    );
  };

  const formattedDate: string = `${
    isToday()
      ? "Today"
      : isYesterday()
      ? "Yesterday"
      : months[noteDate.getMonth()] + " " + noteDate.getDate()
  },${
    today.getFullYear() === noteDate.getFullYear()
      ? ""
      : " " + noteDate.getFullYear()
  } at ${lastEditedOnTime}`;

  return formattedDate;
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
