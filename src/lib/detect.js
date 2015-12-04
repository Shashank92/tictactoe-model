var _ = require('lodash')
Object.assign(global, require('./constants'))

// Core Utility
function markedBy(mark, grid, cellIndex) {
    return grid[cellIndex] === mark
}

function twoMarkedBy(mark, grid, row) {
    var cellIsMine = _.partial(markedBy, mark, grid)
    return _.filter(row, cellIsMine).length === 2
}

function allMarkedBy(mark, grid, row) {
    var cellIsMine = _.partial(markedBy, mark, grid)
    return _.every(row, cellIsMine)
}

// Interface
function winningRow(mark, grid) {
    var allCellsAreMine = _.partial(allMarkedBy, mark, grid)
    return _.find(ROWS, allCellsAreMine)
}

function freeSpaces(grid) {
    return _.reduce(_.toArray(grid), function(freeSpaces, cell, cellIndex) {
        return  cell === FREE_SPACE
                ? freeSpaces.concat(cellIndex)
                : freeSpaces
    }, [])
}

function isEmpty(grid) {
    return _.every(_.toArray(grid), function(cell) {
        return cell === FREE_SPACE
    })
}

function waysToWin(mark, grid) {
    var twoCellsAreMine = _.partial(twoMarkedBy, mark, grid)
    function findFreeSpace(row) {
        return _.find(row, function(cellIndex) {
            return grid[cellIndex] === FREE_SPACE
        })
    }

    var filterMostlyMineRows = _.partialRight(_.filter, twoCellsAreMine)
    var mapRowsToFreeSpace = _.partialRight(_.map, findFreeSpace)
    var filterDefined = _.partialRight(_.filter, _.negate(_.isUndefined))
    var sort = _.sortBy
    var uniqSorted = _.partialRight(_.uniq, true)

    var findAllWaysToWin = _.flow(
        filterMostlyMineRows,
        mapRowsToFreeSpace,
        filterDefined,
        sort,
        uniqSorted
    )

    return findAllWaysToWin(ROWS)
}

function children(mark, grid) {
    return _.map(freeSpaces(grid), function(freeSpace) {
        return {
            path: freeSpace,
            grid: grid.substr(0, freeSpace)
                    + mark
                    + grid.substr(freeSpace + 1)
        }
    })
}

function childIsFork(mark, child) {
    return waysToWin(mark, child.grid).length > 1
}

module.exports = {
    winningRow: winningRow,
    freeSpaces: freeSpaces,
    isEmpty: isEmpty,
    waysToWin: waysToWin,
    children: children,
    childIsFork: childIsFork
}