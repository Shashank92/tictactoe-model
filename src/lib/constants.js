export const FREE_SPACE = 'f'
export const X = 'x'
export const O = 'o'
export const ROWS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
export const SIDES = [1, 3, 5, 7]
export const CORNERS = [0, 2, 6, 8]
export const CENTER = 4
export const OPPOSITE_CORNER = {
    0: 8,
    2: 6,
    6: 2,
    8: 0
}