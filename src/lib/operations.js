var ai = require('./ai')
var C = require('./compute')
var FREE_SPACE = require('./constants').FREE_SPACE

function markCell(mark, grid, index) {
  if (grid[index] === FREE_SPACE) {
    return grid.substr(0, index)
      + mark
      + grid.substr(index + 1)
  } else {
    throw new Error('Attempting to mark an occupied or invalid cell.')
  }
}

function yieldToAi(mark, grid) {
  var winner
  var winningRow
  var outcomeString
  var index = ai(mark, grid)
  var newGrid = markCell(mark, grid, index)
  if (winningRow = C.winningRow(mark, newGrid)) {
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

function chooseCell(mark, grid, index) {
  var winner
  var winningRow
  var outcomeString
  var newGrid = markCell(mark, grid, index)
  if (winningRow = C.winningRow(mark, newGrid)) {
    winner = mark
    outcomeString = winner.toUpperCase() + ' wins!'
  } else if (C.isFull(newGrid)) {
    winner = null
    outcomeString = 'The game is a draw...'
  } else {
    var aiMark = mark === X ? O : X
    return yieldToAi(aiMark, newGrid)
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