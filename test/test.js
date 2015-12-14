var expect = require('chai').expect
var C = require('../src/lib/compute')
var ops = require('../src/lib/operations')
var ai = require('../src/lib/ai')
var ttt = require('../src/ttt')
var _ = require('lodash')
_.assign(global, require('../src/lib/constants'))

function testCompute(C) {
  //*
  //***freeSpaces***
  expect(C.freeSpaces('fffffffff')).deep.equal([0,1,2,3,4,5,6,7,8])
  expect(C.freeSpaces('oofofofoo')).deep.equal([2, 4, 6])
  expect(C.freeSpaces('fxxxfxxxf')).deep.equal([0, 4, 8])

  
  // ***isEmpty/isFull***
  expect(C.isEmpty('fffffffff')).equal(true)
  expect(C.isEmpty('ffffxffff')).equal(false)
  expect(C.isEmpty('ffffoffff')).equal(false)
  expect(C.isFull('xxxxxxxxf')).equal(false)
  expect(C.isFull('ooooooooo')).equal(true)

  // ***winningRow***

  // Empty
  expect(C.winningRow(X, 'fffffffff')).is.undefined
  expect(C.winningRow(O, 'fffffffff')).is.undefined

  
  // Straight Line
  expect(C.winningRow(X, 'xxxofooof')).deep.equal([0, 1, 2])
  expect(C.winningRow(O, 'xxxooofff')).deep.equal([3, 4, 5])
  
  // Ciags
  expect(C.winningRow(X, 'xoooxooox')).deep.equal([0, 4, 8])
  
  expect(C.winningRow(X, 'ooxoxoxoo')).deep.equal([2, 4, 6])

  expect(C.winningRow(O, 'oxxxoxxxo')).deep.equal([0, 4, 8])
  expect(C.winningRow(O, 'xxoxoxoxx')).deep.equal([2, 4, 6])

  // ***waysToWin***
  expect(C.waysToWin(X, 'xfffffffx')).deep.equal([4])
  expect(C.waysToWin(O, 'ffofffoff')).deep.equal([4])
  expect(C.waysToWin(X, 'xfofffxfo')).deep.equal([3])
  expect(C.waysToWin(O, 'xfofffxfo')).deep.equal([5])
  expect(C.waysToWin(X, 'xfxfffxfx')).deep.equal([1, 3, 4, 5, 7])

  // ***children***
  var expected = [ { path: 7, grid: 'xxxxxxxxx' } ]
  expect(C.children(X, 'xxxxxxxfx')).deep.equal(expected)
  expected = [ 
    { path: 0, grid: 'oooooooof' },
    { path: 8, grid: 'foooooooo' },
  ]
  expect(C.children(O, 'fooooooof')).deep.equal(expected)
  //*/

  console.log('Compute - all tests passed.')
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

function testAi(ai) {
  expect(ai(X, 'fffffffff')).equal(0)
  expect(ai(O, 'xffffffff')).equal(4)
  expect(ai(O, 'ffffxffff')).equal(0)
  expect(ai(X, 'offfxffff')).equal(8)

  console.log('AI - all tests passed.')
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
  testCompute(C)
  testOperations(ops)
  testAi(ai)
  testTTT(ttt)
} else {
  module.exports = {
    C: C,
    ops: ops,
    ai: ai,
    ttt: ttt,
    testCetect: testCetect,
    testOperations: testOperations,
    testTTT: testTTT,
  }
}