export const formatDate = (date: number): string => {
  const dateFormatter = new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
};