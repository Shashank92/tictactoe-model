var expect = require('chai').expect
var D = require('../src/lib/detect')
var ops = require('../src/lib/operations')
var ttt = require('../src/ttt')
var _ = require('lodash')
_.assign(global, require('../src/lib/constants'))

function testDetect(D) {
  //*
  //***freeSpaces***
  expect(D.freeSpaces('fffffffff')).deep.equal([0,1,2,3,4,5,6,7,8])
  expect(D.freeSpaces('oofofofoo')).deep.equal([2, 4, 6])
  expect(D.freeSpaces('fxxxfxxxf')).deep.equal([0, 4, 8])

  
  // ***isEmpty/isFull***
  expect(D.isEmpty('fffffffff')).equal(true)
  expect(D.isEmpty('ffffxffff')).equal(false)
  expect(D.isEmpty('ffffoffff')).equal(false)
  expect(D.isFull('xxxxxxxxf')).equal(false)
  expect(D.isFull('ooooooooo')).equal(true)

  // ***winningRow***

  // Empty
  expect(D.winningRow(X, 'fffffffff')).is.undefined
  expect(D.winningRow(O, 'fffffffff')).is.undefined

  
  // Straight Line
  expect(D.winningRow(X, 'xxxofooof')).deep.equal([0, 1, 2])
  expect(D.winningRow(O, 'xxxooofff')).deep.equal([3, 4, 5])
  
  // Diags
  expect(D.winningRow(X, 'xoooxooox')).deep.equal([0, 4, 8])
  
  expect(D.winningRow(X, 'ooxoxoxoo')).deep.equal([2, 4, 6])

  expect(D.winningRow(O, 'oxxxoxxxo')).deep.equal([0, 4, 8])
  expect(D.winningRow(O, 'xxoxoxoxx')).deep.equal([2, 4, 6])

  // ***waysToWin***
  expect(D.waysToWin(X, 'xfffffffx')).deep.equal([4])
  expect(D.waysToWin(O, 'ffofffoff')).deep.equal([4])
  expect(D.waysToWin(X, 'xfofffxfo')).deep.equal([3])
  expect(D.waysToWin(O, 'xfofffxfo')).deep.equal([5])
  expect(D.waysToWin(X, 'xfxfffxfx')).deep.equal([1, 3, 4, 5, 7])

  // ***children***
  var expected = [ { path: 7, grid: 'xxxxxxxxx' } ]
  expect(D.children(X, 'xxxxxxxfx')).deep.equal(expected)
  expected = [ 
    { path: 0, grid: 'oooooooof' },
    { path: 8, grid: 'foooooooo' },
  ]
  expect(D.children(O, 'fooooooof')).deep.equal(expected)
  //*/

  console.log('Detect - all tests passed.')
  return true
}

function testOperations(ops) {
  var gameState = ops.yieldToAi(X, 'fffffffff')
  var expectedGameState = {
    grid: 'xffffffff',
    winner: undefined,
    winningRow: undefined,
    outcomeString: undefined,
  }
  expect(gameState).deep.equal(expectedGameState)

  var gameState = ops.chooseCell(X, 'xxfffffff', 2)
  var expectedGameState = {
    grid: 'xxxffffff',
    winner: X,
    winningRow: [0, 1, 2],
    outcomeString: 'X wins!',
  }
  expect(gameState).deep.equal(expectedGameState)

  console.log('Operations - all tests passed.')
  return true
}

function testTTT(ttt) {
  var game = ttt.newGame()
  expect(game.getPlayerMark()).equal(X)
  expect(game.getAiMark()).equal(O)
  expect(game.getWinner()).is.undefined
  expect(game.getWinningRow()).is.undefined
  expect(game.getOutcomeString()).is.undefined
  expect(game.getGrid()).equal('fffffffff')
  var expectedGameStateString = ' | | '
    + '\n-----'
    + '\n | | '
    + '\n-----'
    + '\n | | '
    + '\nX\'s turn.'
  expect(game.gameStateString()).equal(expectedGameStateString)

  var game = ttt.newGameX()
  expect(game.getPlayerMark()).equal(X)
  expect(game.getAiMark()).equal(O)
  expect(game.getWinner()).is.undefined
  expect(game.getWinningRow()).is.undefined
  expect(game.getOutcomeString()).is.undefined
  expect(game.getGrid()).equal('fffffffff')
  var expectedGameStateString = ' | | '
    + '\n-----'
    + '\n | | '
    + '\n-----'
    + '\n | | '
    + '\nX\'s turn.'
  expect(game.gameStateString()).equal(expectedGameStateString)

  var game = ttt.newGameO()
  expect(game.getPlayerMark()).equal(O)
  expect(game.getAiMark()).equal(X)
  expect(game.getWinner()).is.undefined
  expect(game.getWinningRow()).is.undefined
  expect(game.getOutcomeString()).is.undefined
  expect(game.getGrid()).equal('xffffffff')
  var expectedGameStateString = 'X| | '
    + '\n-----'
    + '\n | | '
    + '\n-----'
    + '\n | | '
    + '\nO\'s turn.'
  expect(game.gameStateString()).equal(expectedGameStateString)
  game.chooseCell(4)
  var grid = game.getGrid()
  var counts = _.countBy(grid)
  expect(counts.x).equal(2)
  expect(counts.o).equal(1)
  expect(counts.f).equal(6)

  console.log('TicTacToe - all tests passed.')
  return true
}

if (require.main === module) {
  testDetect(D)
  testOperations(ops)
  testTTT(ttt)
} else {
  module.exports = {
    D: D,
    ops: ops,
    ttt: ttt,
    testDetect: testDetect,
    testOperations: testOperations,
    testTTT: testTTT,
  }
}