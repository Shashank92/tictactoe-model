var constants = require('./constants')

function marked(mark, grid, index) {
    return mark === grid[index]
}

function twoConsecutive(predicate, array) {
    var last = false
    for (var i = 0, n = array.length; i < n; i++) {
        var value = array[i]
        var current = predicate(value)
        if (last && current)
            return true
        else
            last = current
    }
}

function detectWin(mark, grid) {
    var ROWS = constants.ROWS
    var marked = marked.bind(null, mark, grid)
    return ROWS.some(function(row) {
        return row.every(marked)
    })
}

function detectTwoInARow(mark, grid) {
    var ROWS = constants.ROWS
    var marked = marked.bind(null, mark, grid)
    for (var i = 0, n = ROWS.length; i < n; i++) {
        var row = ROWS[i]
        if (twoConsecutive(marked, row))
            return row
    }
}

function detectFreeSpaces(grid) {
    var FREE_SPACE = constants.FREE_SPACE
    return Array.from(grid).reduce(function(freeSpaces, space, index) {
        if (space === FREE_SPACE)
            freeSpaces.push(index)
        return freeSpaces
    }, [])
}

module.exports = {
    detectWin: detectWin,
    detectTwoInARow: detectTwoInARow,
    detectFreeSpaces: detectFreeSpaces
}