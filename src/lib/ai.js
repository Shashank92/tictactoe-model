var _ = require('lodash')
var C = require('./compute')
_.assign(global, require('./constants'))

function ai(grid, mark) {
  var freeSpaces = C.freeSpaces(grid)

  function randomChoice(freeSpaces) {
    var randomIndex = Math.floor(Math.random() * freeSpaces.length)
    return freeSpaces[randomIndex]
  }

  function bestChoice(freeSpaces) {
    // If X and first move, 
    // move top left corner to be as aggressive as possible.
    var isEmpty = C.isEmpty(grid)
    if (isEmpty) {
      return 0
    } 
    // If there is a way to win, take it.
    var waysToWin = C.waysToWin(grid, mark)
    if (waysToWin.length) {
      return _.first(waysToWin)
    }

    // If your opponent can win, block them.
    var playerMark = mark === X ? O : X
    var cellsToBlock = C.waysToWin(grid, playerMark)
    if (cellsToBlock.length) {
      return _.first(cellsToBlock)
    }

    // Create fork if possible.
    var children = C.children(grid, mark)
    var isFork = _.partial(C.childIsFork, _, mark)
    var forkPaths = _(children)
      .filter(isFork)
      .map(C.childPath)
      .value()
    if (forkPaths.length) {
      return _first(forkPaths)
    }

    // Block opponent's chance to fork
    // It's preferable to force the opponent to defend if
    // they cannot simultaneously defend and create a fork.
    var childrenWithPressure = C.childrenWithPressure(children, mark)
    var playerChildren = C.children(grid, playerMark)
    var isPlayerFork = _.partial(C.childIsFork, _, playerMark)

    var playerForkPaths = _(playerChildren)
      .filter(isPlayerFork)
      .map(C.childPath)
      .value()

    var pathsWithTruePressure = _(childrenWithPressure)
      .filter(function(child) {
        return _.difference(child.waysToWin, playerForkPaths).length
      })
      .map(C.childPath)
      .value()

    if (pathsWithTruePressure.length) {
      return _.first(pathsWithTruePressure)
    } else if (playerForkPaths.length) {
      return _first(playerForkPaths)
    }

    // If center is free, and it's not the first move of the game,
    // take it!!
    if (_.includes(freeSpaces, CENTER)) {
      return CENTER
    }

    // Opposite corner: If player is in the corner, 
    // play the opposite corner.
    var playerOwnedCorners = C.cornersOwned(grid, playerMark)
    if (playerOwnedCorners.length) {
      return C.oppositeCorner(_.first(playerOwnedCorners))
    }

    // Empty corner: The player plays in a corner square.
    var freeCorner = _.find(freeSpaces, C.isCorner)
    if (_.isNumber(freeCorner)) {
      return freeCorner
    }

    // Return first empty side
    return freeSpaces[0]
  }

  return bestChoice(freeSpaces)
}

module.exports = ai