var _ = require('lodash')
var D = require('./detect')
Object.assign(global, require('./constants'))

function ai(mark, grid) {
    var freeSpaces = D.freeSpaces(grid)

    function randomChoice() {
        var randomIndex = Math.floor(Math.random() * freeSpaces.length)
        return freeSpaces[randomIndex]
    }

    function bestChoice() {
        // If X and first move, 
        // move top left corner to be as aggressive as possible.
        var isEmpty = D.isEmpty(grid)
        if (isEmpty) {
            return 0
        } 
        // If there is a way to win, take it.
        var waysToWin = D.waysToWin(mark, grid)
        if (waysToWin.length) {
            return _.first(waysToWin)
        }

        // If your opponent can win, block them.
        var opponentsMark = mark === X ? O : X
        var cellsToBlock = D.waysToWin(opponentsMark, grid)
        if (cellsToBlock.length) {
            return _.first(cellsToBlock)
        }

        // Detect children that are forks
        // Create fork if possible.
        var children = D.children(mark, grid)
        var detectChildFork = _.partial(D.childIsFork, mark)
        var forks = _.filter(children, detectChildFork)
        if (forks.length) {
            return _first(forks).path
        }

        // Block opponent's chance to fork
        // Preferably as aggressively as possible.
        var opponentsChildren = D.children(opponentsMark, grid)
        var detectOpponentChildFork = _.partial(D.childIsFork, opponentsMark)
        var opponentsForks = children.filter(detectOpponentChildFork)
        if (opponentsForks.length) {
            return _first(opponentsForks).path
        }

        if (~freeSpaces.indexOf(CENTER)) {
            return CENTER
        }
        // Opposite corner: If the opponent is in the corner, 
        // play the opposite corner.
        return randomChoice()
    }

    return bestChoice()
}

module.exports = ai