export const getStraightMoves = (
  range: number,
  origRow: number,
  origCol: number
) => {
  var validSquares: string[] = [];
  for (var i = 1; i <= range; i++) {
    var newRows = [origRow + i, origRow - i];
    newRows.forEach((newRow) => {
      validSquares.push(`${newRow}-${origCol}`);
    });

    var newCols = [origCol + i, origCol - i];
    newCols.forEach((newCol) => {
      validSquares.push(`${origRow}-${newCol}`);
    });
  }
  return validSquares;
};

export const getDiagonalMoves = (
  range: number,
  origRow: number,
  origCol: number
) => {
  var validSquares: string[] = [];
  for (var i = 1; i <= range; i++) {
    var newRows = [origRow + i, origRow - i];
    var newCols = [origCol + i, origCol - i];

    newRows.forEach((newRow) => {
      newCols.forEach((newCol) => {
        validSquares.push(`${newRow}-${newCol}`);
      });
    });
  }
  return validSquares;
};

export const getMultiDirMoves = (
  range: number,
  origRow: number,
  origCol: number
) => {
  var validSquares: string[] = getStraightMoves(range, origRow, origCol);
  validSquares = validSquares.concat(getDiagonalMoves(range, origRow, origCol));
  return validSquares;
};
