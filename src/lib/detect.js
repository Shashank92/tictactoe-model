var constants = require('./constants')

function exists(value) {
    return typeof value !== 'undefined' && value !== null
}

function assertMarkExists(mark) {
    if (!exists(mark))
        throw new Error('Mark is undefined or null.')
}

function assertGridExists(grid) {
    if (!exists(grid))
        throw new Error('Grid is undefined or null.') 
}

function marked(mark, grid, index) {
    return mark === grid[index]
}

function detectWin(mark, grid) {
    assertMarkExists(mark)
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
    assertGridExists(grid)
    return Array.from(grid).every(function(c) {
        return c === 'f'
    })
}

function detectWaysToWin(mark, grid) {
    assertMarkExists(mark)
    assertGridExists(grid)
    
}

module.exports = {
    detectWin: detectWin,
    detectFreeSpaces: detectFreeSpaces,
    detectEmpty: detectEmpty,
    detectWaysToWin: detectWaysToWin
}