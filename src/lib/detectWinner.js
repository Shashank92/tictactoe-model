import {X, O, ROWS} from './constants'

export default function detectWinner(grid) {
    let winner
    let markedByX = index => grid[index] === X
    let markedByO = index => grid[index] === O
    ROWS.some((row) => {
        if (row.every(markedByX))
            winner = X
        else if (row.every(markedByO))
            winner = O
        return winner
    })
    return winner
}