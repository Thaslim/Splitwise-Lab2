const startTime = () => {
  const today = new Date();
  const time =
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds() +
    ':' +
    today.getMilliseconds();
  return time;
};

export default startTime;
