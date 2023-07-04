const generateUuid = (a?: string): string => {
  return a
    ? (0 | (Math.random() * 16)).toString(16)
    : ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/1|0/g, generateUuid);
};

export default generateUuid;
