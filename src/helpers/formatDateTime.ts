export const formatDateTime = (date: string): string => {
  const today = new Date();
  const noteDate = new Date(date);
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
