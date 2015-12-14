var ai = require('./ai')
var C = require('./compute')
var FREE_SPACE = require('./constants').FREE_SPACE

function markCell(grid, mark, index) {
  if (grid[index] === FREE_SPACE) {
    return grid.substr(0, index)
      + mark
      + grid.substr(index + 1)
  } else {
    throw new Error('Attempting to mark an occupied or invalid cell.')
  }
}

function yieldToAi(grid, mark) {
  var winner
  var winningRow
  var outcomeString
  var index = ai(grid, mark)
  var newGrid = markCell(grid, mark, index)
  if (winningRow = C.winningRow(newGrid, mark)) {
    winner = mark
    outcomeString = winner.toUpperCase() + ' wins!'
  } else if (C.isFull(newGrid)) {
    winner = null
    outcomeString = 'The game is a draw...'
  }
  return {
    grid: newGrid,
    winner: winner,
    winningRow: winningRow,
    outcomeString: outcomeString,
  }
}

function chooseCell(grid, mark, index) {
  var winner
  var winningRow
  var outcomeString
  var newGrid = markCell(grid, mark, index)
  if (winningRow = C.winningRow(newGrid, mark)) {
    winner = mark
    outcomeString = winner.toUpperCase() + ' wins!'
  } else if (C.isFull(newGrid)) {
    winner = null
    outcomeString = 'The game is a draw...'
  } else {
    var aiMark = mark === X ? O : X
    return yieldToAi(newGrid, aiMark)
  }
  return {
    grid: newGrid,
    winner: winner,
    winningRow: winningRow,
    outcomeString: outcomeString,
  }
}

module.exports = {
  yieldToAi: yieldToAi,
  chooseCell: chooseCell,
}