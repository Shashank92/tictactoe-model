import * as constants from './constants'

function marked(mark, grid, index) {
    return mark === grid[index]
}

function twoConsecutive(func, array) {
    let last = false
    for (let value of array) {
        let current = func(value)
        if (last && current)
            return true
        else
            last = current
    }
}

export function detectWin(mark, grid) {
    let marked = marked.bind(null, mark, grid)
    return constants.ROWS.some(row => row.every(marked))
}

export function detectTwoInARow(mark, grid) {
    let marked = marked.bind(null, mark, grid)
    for (let row of constants.ROWS) {
        if (twoConsecutive(marked, row))
            return row
    }
}

export function detectFreeSpaces(grid) {
    const FREE_SPACE = constants.FREE_SPACE
    return Array.from(grid).reduce((freeSpaces, space, index) => {
        if (space === FREE_SPACE)
            freeSpaces.push(index)
        return freeSpaces
    }, [])
}