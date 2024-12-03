export const formatDateTime = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // for AM/PM
  });
  return formatter.format(date);
};

export const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-us", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  return formatter.format(date);
};
