var constants = require('./constants')

function assertGridExists(grid) {
    if (typeof grid === 'undefined' || grid === null)
        throw new Error('Grid is not initialized.') 
}

function marked(mark, grid, index) {
    return mark === grid[index]
}

function detectWin(mark, grid) {
    assertGridExists(grid)
    var ROWS = constants.ROWS
    var spaceIsMine = marked.bind(null, mark, grid)
    return ROWS.some(function(row) {
        return row.every(spaceIsMine)
    })
}

function detectFreeSpaces(grid) {
    assertGridExists(grid)
    var FREE_SPACE = constants.FREE_SPACE
    return Array.from(grid).reduce(function(freeSpaces, space, index) {
        if (space === FREE_SPACE)
            freeSpaces.push(index)
        return freeSpaces
    }, [])
}

function detectEmpty(grid) {
    return Array.from(grid).every(function(c) {
        return c === 'f'
    })
}

module.exports = {
    detectWin: detectWin,
    detectFreeSpaces: detectFreeSpaces,
    detectEmpty: detectEmpty,
}