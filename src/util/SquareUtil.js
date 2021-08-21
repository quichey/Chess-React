export const idToCell = (id) => {
  return id.split("-").slice(0, 2);
};

export const cellToId = () => {
  return `${cell[0]}-${cell[1]}`;
};
