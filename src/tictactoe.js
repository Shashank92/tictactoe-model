var _ = require('lodash')
var ops = require('./lib/operations')
var constants = require('./lib/constants')
var FREE_SPACE = constants.FREE_SPACE
var X = constants.X
var O = constants.O

function advanceState(index) {
  var grid = this.grid
  var gameState
  if (_.isNumber(index)) {
    gameState = ops.chooseCell(grid, this.playerMark, index)
  } else {
    gameState = ops.yieldToAi(grid, this.aiMark)
  }
  return _.assign(this, gameState)
}

function logGameState() {
  console.log(this.gameStateString)
  return this
}

function TicTacToe(playerMark) {
  this.playerMark = playerMark = playerMark || X
  this.aiMark = playerMark === X ? O : X
  this.grid = _.repeat(FREE_SPACE, 9)
  this.turn = X
  if (this.aiMark === X) {
    this.advanceState()
  }
}

TicTacToe.prototype = {
  advanceState: advanceState,
  chooseCell: advanceState,
  get gameStateString() {
    var gridString = this.grid.replace(/f/g, ' ').toUpperCase()
    var outcomeString = this.outcomeString
    var footnote = outcomeString
      ? outcomeString
      : this.turn.toUpperCase() + "'s turn."
    return _(_.range(0, 9, 3))
      .map(function(i) {
        return _.toArray(gridString.substr(i, 3)).join('|')
      })
      .thru(function(strings) {
        return strings.join('\n-----\n') + '\n' + footnote
      })
      .value()
  },
  logGameState: logGameState,
}

module.exports = TicTacToe