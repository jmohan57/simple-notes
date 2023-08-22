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
      : lastEditedOnDate
  }, at ${lastEditedOnTime}`;

  return formattedDate;
};
