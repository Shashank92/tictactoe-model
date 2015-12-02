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

function checkMark(mark, grid, index) {
    return grid[index] === mark
}

function detectWin(mark, grid) {
    assertMarkExists(mark)
    assertGridExists(grid)
    var ROWS = constants.ROWS
    var spaceIsMine = checkMark.bind(null, mark, grid)

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
    var FREE_SPACE = constants.FREE_SPACE
    return Array.from(grid).every(function(c) {
        return c === FREE_SPACE
    })
}

function checkTwoMarked(mark, grid, row) {
    var spaceIsMine = checkMark.bind(null, mark, grid)
    return row.filter(spaceIsMine).length === 2
}

function checkFreeSpace(grid, index) {
    return grid[index] === constants.FREE_SPACE
}

function detectWaysToWin(mark, grid) {
    assertMarkExists(mark)
    assertGridExists(grid)
    var ROWS = constants.ROWS
    var twoSpacesAreMine = checkTwoMarked.bind(null, mark, grid)
    var spaceIsFree = checkFreeSpace.bind(null, grid)

    return ROWS.filter(twoSpacesAreMine).map(function(row) {
        return row.find(spaceIsFree)
    }).filter(exists)
}

module.exports = {
    detectWin: detectWin,
    detectFreeSpaces: detectFreeSpaces,
    detectEmpty: detectEmpty,
    detectWaysToWin: detectWaysToWin
}