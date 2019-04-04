const formatNumber = n => {
  return n < 10 ? '0' + n : '' + n;
};

export const formatTime = createdAt => {
  const date = new Date(createdAt);
  return (
    formatNumber(date.getMonth() + 1) +
    '-' +
    formatNumber(date.getDate()) +
    ' ' +
    formatNumber(date.getHours()) +
    ':' +
    formatNumber(date.getMinutes())
  );
};
