module.exports = {
  FREE_SPACE: 'f',
  X: 'x',
  O: 'o',
  ROWS: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
  CORNERS: [0, 2, 6, 8],
  EDGES: [1, 3, 5, 7],
  CENTER: 4,
  OPPOSITE_CORNER: {
    0: 8,
    2: 6,
    6: 2,
    8: 0,
  },
}