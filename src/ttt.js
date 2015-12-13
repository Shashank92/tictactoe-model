var _ = require('lodash')
var ops = require('./lib/operations')
var constants = require('./lib/constants')
var FREE_SPACE = constants.FREE_SPACE
var X = constants.X
var O = constants.O

function newGame(playerMark) {
  playerMark = playerMark || X
  var aiMark = playerMark === X ? O : X
  var grid = _.repeat(FREE_SPACE, 9)
  // To be decided upon.
  var winner
  var winningRow
  var outcomeString

  function getPlayerMark() {
    return playerMark
  }

   function getAiMark() {
    return aiMark
  }

  function getGrid() {
    return grid
  }

  function getWinner() {
    return winner
  }

  function getWinningRow() {
    return winningRow
  }

  function getOutcomeString() {
    return outcomeString
  }

  function gameStateString() {
    var gridString = grid.replace(/f/g, ' ').toUpperCase()
    var footnote = outcomeString
      ? outcomeString
      : playerMark.toUpperCase() + "'s turn."
    return _(_.range(0, 9, 3))
      .map(function(i) {
        return _.toArray(gridString.substr(i, 3)).join('|')
      })
      .thru(function(strings) {
        return strings.join('\n-----\n') + '\n' + footnote
      })
      .value()
  }

  function logGameState() {
    console.log(gameStateString())
    return tttGame
  }

  function advanceState(computeNextState) {
    // broken ATM
    var gameState = computeNextState(mark, grid)
    grid = gameState.grid
    winner = gameState.winner
    winningRow = gameState.winningRow
    outcomeString = gameState.outcomeString
    return tttGame
  }

  if (aiMark === X)
    advanceState(ops.yieldToAi)

  var tttGame = {
    getPlayerMark: getPlayerMark,
    getAiMark: getAiMark,
    getGrid: getGrid,
    getWinner: getWinner,
    getWinningRow: getWinningRow,
    getOutcomeString: getOutcomeString,
    gameStateString: gameStateString,
    logGameState: logGameState,
    chooseCell: _.partial(advanceState, ops.chooseCell)
  }

  return tttGame
}

module.exports = {
  newGame: newGame,
  newGameX: _.partial(newGame, X),
  newGameO: _.partial(newGame, O),
}
