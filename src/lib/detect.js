var constants = require('./constants')

Object.assign(global, constants)

// General Utility
function exists(value) {
    return typeof value !== 'undefined' && value !== null
}

function assertGridExists(grid) {
    if (!exists(grid))
        throw new Error('Grid is either undefined or null.')
}

function unique(values) {
    return values.reduce(function(seen, value) {
        return ~seen.indexOf(value) ? seen : seen.concat(value)
    }, [])
}

function D(grid) {
    assertGridExists(grid)

    // Utility
    function isFreeSpace(index) {
        return grid[index] === FREE_SPACE
    }

   function markedBy(mark, index) {
        return grid[index] === mark
    }

    function twoMarkedBy(mark, row) {
        var spaceIsMine = markedBy.bind(null, mark)
        return row.filter(spaceIsMine).length === 2
    }

    // Interface
    function isEmpty() {
        return Array.from(grid).every(function(character, index) {
            return isFreeSpace(index)
        })
    }

    function freeSpaces() {
        return Array.from(grid).reduce(function(freeSpace, space, index) {
            return  space === FREE_SPACE
                    ? freeSpace.concat(index)
                    : freeSpace
        }, [])
    }

    function wins(mark) {
        var spaceIsMine = markedBy.bind(null, mark)
        return ROWS.some(function(row) {
            return row.every(spaceIsMine)
        })
    }

    function waysToWin(mark) {
        var twoSpacesAreMine = twoMarkedBy.bind(null, mark)
        return  unique(
                    ROWS.filter(twoSpacesAreMine)
                    .map(function(row) {
                        return row.find(isFreeSpace)
                    })
                    .filter(exists)
                ).sort()
    }

    return {
        isEmpty: isEmpty,
        freeSpaces: freeSpaces,
        wins: wins,
        waysToWin: waysToWin
    }
}

module.exports = D