export const formatDateTime = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // for AM/PM
  });
  return formatter.format(date);
};

export const formatTime = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // for AM/PM
  });
  return formatter.format(date);
};

export const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-us', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
  return formatter.format(date);
};

export const formatSessionTime = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const dayOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
  };

  const dayOfWeek = new Intl.DateTimeFormat("en-US", dayOptions).format(
    startDate
  );
  const startTime = new Intl.DateTimeFormat("en-US", timeOptions).format(
    startDate
  );
  const endTime = new Intl.DateTimeFormat("en-US", timeOptions).format(endDate);

  return `${dayOfWeek} ${startTime} - ${endTime}`;
};
