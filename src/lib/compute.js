var _ = require('lodash')
_.assign(global, require('./constants'))

// Core Utility
function markedBy(grid, mark, cellIndex) {
  return grid[cellIndex] === mark
}

function twoMarkedBy(grid, mark, row) {
  var cellIsMine = _.partial(markedBy, grid, mark)
  return _.filter(row, cellIsMine).length === 2
}

function allMarkedBy(grid, mark, row) {
  var cellIsMine = _.partial(markedBy, grid, mark)
  return _.every(row, cellIsMine)
}

// Interface
function winningRow(grid, mark) {
  var allCellsAreMine = _.partial(allMarkedBy, grid, mark)
  return _.find(ROWS, allCellsAreMine)
}

function waysToWin(grid, mark) {
  var twoCellsAreMine = _.partial(twoMarkedBy, grid, mark)
  var findFreeSpace = function(row) {
    return _.find(row, function(cellIndex) {
      return grid[cellIndex] === FREE_SPACE
    })
  }

  return _(ROWS)
    .filter(twoCellsAreMine)
    .map(findFreeSpace)
    .filter(_.isNumber)
    .sortBy()
    .uniq(true)
    .value()
}

function freeSpaces(grid) {
  return _.reduce(grid, function(freeSpaces, cell, cellIndex) {
    return cell === FREE_SPACE
      ? freeSpaces.concat(cellIndex)
      : freeSpaces
  }, [])
}

function isEmpty(grid) {
  return _.every(grid, function(cell) {
    return cell === FREE_SPACE
  })
}

function isFull(grid) {
  return _.every(grid, function(cell) {
    return cell !== FREE_SPACE
  })
}

function children(grid, mark) {
  return _.map(freeSpaces(grid), function(freeSpace) {
    return {
      path: freeSpace,
      grid: grid.substr(0, freeSpace)
        + mark
        + grid.substr(freeSpace + 1),
    }
  })
}

function childIsFork(child, mark) {
  return waysToWin(child.grid, mark).length > 1
}

function isCorner(index) {
  return _.includes(CORNERS, index)
}

function cornersOwned(grid, mark) {
  return _(grid)
    .map(function(cell, cellIndex) {
      return cell === mark ? cellIndex : undefined
    })
    .filter(_.isNumber)
    .filter(isCorner)
    .value()
}

var oppositeCorner = (function() {
  var _oppositeCorner = {
    0: 8,
    2: 6,
    6: 2,
    8: 0,
  }
  return function oppositeCorner(index) {
    return _oppositeCorner[index]
  }
})()

module.exports = {
  winningRow: winningRow,
  waysToWin: waysToWin,
  freeSpaces: freeSpaces,
  isEmpty: isEmpty,
  isFull: isFull,
  children: children,
  childIsFork: childIsFork,
  isCorner: isCorner,
  cornersOwned: cornersOwned,
  oppositeCorner: oppositeCorner,
}
