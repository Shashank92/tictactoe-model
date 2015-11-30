import {ROWS} from './constants'

export default function detectWin(mark, grid) {
    let marked = index => grid[index] === mark
    return ROWS.some(row => row.every(marked))
}