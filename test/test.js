var expect = require('chai').expect
var C = require('../src/lib/compute')
var ops = require('../src/lib/operations')
var ai = require('../src/lib/ai')
var TicTacToe = require('../src/tictactoe')
var _ = require('lodash')
_.assign(global, require('../src/lib/constants'))

// ---------------------------------------------------------

function testCompute(C) {
  //*
  // ***winningRow***

  // Empty
  expect(C.winningRow('fffffffff', X)).is.undefined
  expect(C.winningRow('fffffffff', O)).is.undefined

  
  // Straight Line
  expect(C.winningRow('xxxofooof', X)).deep.equal([0, 1, 2])
  expect(C.winningRow('xxxooofff', O)).deep.equal([3, 4, 5])
  
  // Diags
  expect(C.winningRow('xoooxooox', X)).deep.equal([0, 4, 8])
  expect(C.winningRow('ooxoxoxoo', X)).deep.equal([2, 4, 6])

  expect(C.winningRow('oxxxoxxxo', O)).deep.equal([0, 4, 8])
  expect(C.winningRow('xxoxoxoxx', O)).deep.equal([2, 4, 6])

  // ***waysToWin***
  expect(C.waysToWin('xfffffffx', X)).deep.equal([4])
  expect(C.waysToWin('ffofffoff', O)).deep.equal([4])
  expect(C.waysToWin('xfofffxfo', X)).deep.equal([3])
  expect(C.waysToWin('xfofffxfo', O)).deep.equal([5])
  expect(C.waysToWin('xfxfffxfx', X)).deep.equal([1, 3, 4, 5, 7])
  expect(C.waysToWin('xxoxooooo', X)).deep.equal([])
  expect(C.waysToWin('ooxoxxxxx', O)).deep.equal([])

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

  // ***children***
  var expectedChildren = [ { path: 7, grid: 'xxxxxxxxx' } ]
  expect(C.children('xxxxxxxfx', X)).deep.equal(expectedChildren)
  expectedChildren = [ 
    { path: 0, grid: 'oooooooof' },
    { path: 8, grid: 'foooooooo' },
  ]
  expect(C.children('fooooooof', O)).deep.equal(expectedChildren)
  //*/

  console.log('Compute - all tests passed.')
  return true
}

// ---------------------------------------------------------

function testAi(ai) {
  expect(ai('fffffffff', X)).equal(0)
  expect(ai('xffffffff', O)).equal(4)
  expect(ai('ffffxffff', O)).equal(0)
  expect(ai('offfxffff', X)).equal(1)
  expect(ai('ffxfofxff', O)).equal(1)
  expect(ai('ffxxoffff', O)).equal(0)

  console.log('AI - all tests passed.')
  return true
}

// ---------------------------------------------------------

function testOperations(ops) {
  var gameState = ops.yieldToAi('fffffffff', X)
  var expectedGameState = {
    grid: 'xffffffff',
    turn: O,
    winner: undefined,
    winningRow: undefined,
    outcomeString: undefined,
  }
  expect(gameState).deep.equal(expectedGameState)

  var gameState = ops.chooseCell('xxfffffff', X, 2)
  var expectedGameState = {
    grid: 'xxxffffff',
    turn: O,
    winner: X,
    winningRow: [0, 1, 2],
    outcomeString: 'X wins!',
  }
  expect(gameState).deep.equal(expectedGameState)

  console.log('Operations - all tests passed.')
  return true
}

// ---------------------------------------------------------

function testTicTacToe(TicTacToe) {
  var ttt = new TicTacToe()
  expect(ttt.playerMark).equal(X)
  expect(ttt.aiMark).equal(O)
  expect(ttt.winner).is.undefined
  expect(ttt.winningRow).is.undefined
  expect(ttt.outcomeString).is.undefined
  expect(ttt.grid).equal('fffffffff')
  var expectedGameStateString = ' | | '
    + '\n-----'
    + '\n | | '
    + '\n-----'
    + '\n | | '
    + '\nX\'s turn.'
  expect(ttt.gameStateString).equal(expectedGameStateString)

  ttt = new TicTacToe(X)
  expect(ttt.playerMark).equal(X)
  expect(ttt.aiMark).equal(O)
  expect(ttt.winner).is.undefined
  expect(ttt.winningRow).is.undefined
  expect(ttt.outcomeString).is.undefined
  expect(ttt.grid).equal('fffffffff')
  var expectedGameStateString = ' | | '
    + '\n-----'
    + '\n | | '
    + '\n-----'
    + '\n | | '
    + '\nX\'s turn.'
  expect(ttt.gameStateString).equal(expectedGameStateString)

  var ttt = new TicTacToe(O)
  expect(ttt.playerMark).equal(O)
  expect(ttt.aiMark).equal(X)
  expect(ttt.winner).is.undefined
  expect(ttt.winningRow).is.undefined
  expect(ttt.outcomeString).is.undefined
  expect(ttt.grid).equal('xffffffff')
  var expectedGameStateString = 'X| | '
    + '\n-----'
    + '\n | | '
    + '\n-----'
    + '\n | | '
    + '\nO\'s turn.'
  expect(ttt.gameStateString).equal(expectedGameStateString)
  ttt.chooseCell(4)
  var grid = ttt.grid
  var counts = _.countBy(grid)
  expect(counts.x).equal(2)
  expect(counts.o).equal(1)
  expect(counts.f).equal(6)

  console.log('TicTacToe - all tests passed.')
  return true
}

// ---------------------------------------------------------

if (require.main === module) {
  testCompute(C)
  testAi(ai)
  testOperations(ops)
  testTicTacToe(TicTacToe)
} else {
  module.exports = {
    C: C,
    ai: ai,
    ops: ops,
    TicTacToe: TicTacToe,
    testCompute: testCompute,
    testAi: testAi,
    testOperations: testOperations,
    testTicTacToe: testTicTacToe,
  }
}