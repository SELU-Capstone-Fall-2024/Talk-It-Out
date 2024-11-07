const formatDate = (date: Date) => {
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
export default formatDate;
