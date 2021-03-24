const capitalize = (str) => {
  const fl = str.charAt(0).toUpperCase();
  const rl = str.slice(1);
  return fl + rl;
};

export default capitalize;
