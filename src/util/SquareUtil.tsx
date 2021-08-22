export const idToCell = (id: string) => {
  return id
    .split("-")
    .slice(0, 2)
    .map((str: string) => Number(str));
};

export const cellToId = (cell: [number, number]) => {
  return `${cell[0]}-${cell[1]}`;
};

export const rowColToBoardIdx = (row: number, col: number) => {
  return row * 8 + col;
};
