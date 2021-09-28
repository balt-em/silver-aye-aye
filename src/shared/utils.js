// eslint-disable-next-line import/prefer-default-export
export const getDate = dateString => {
  const date = dateString ? new Date(dateString) : new Date();
  date.setUTCHours(16); // noon in Baltimore
  date.setMinutes(0);
  date.setMilliseconds(0);
  date.setSeconds(0);
  return date;
};
