const getFileUrl = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

export { getFileUrl };
