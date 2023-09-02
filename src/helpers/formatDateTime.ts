export const formatDateTime = (date: string | Date): string => {
  const today = new Date();
  const noteDate = typeof date === "string" ? new Date(date) : date;
  const lastEditedOnDate = noteDate.getDate();
  const lastEditedOnTime = noteDate.toLocaleString("en-US", {
    timeStyle: "short",
  });

  const formattedDate: string = `${
    today.getDate() === lastEditedOnDate
      ? "Today"
      : today.getDate() - 1 === lastEditedOnDate
      ? "Yesterday"
      : months[noteDate.getMonth()] + " " + lastEditedOnDate
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
