var _ = require('lodash')
var D = require('./detect')
Object.assign(global, require('./constants'))

function AI(mark, grid) {
    assertMarkExists(mark)
    assertGridExists(grid)
    
    var detect = D(grid)
    var freeSpaces = detect.freeSpaces()

    function randomChoice() {
        var randomIndex = Math.floor(Math.random() * freeSpaces.length)
        return freeSpaces[randomIndex]
    }

    function bestChoice() {
        // If X and first move, 
        // move top left corner to be as aggressive as possible.
        var isEmpty = detect.isEmpty()
        if (isEmpty) {
            return 0
        } 
        // If there is a way to win, take it.
        var waysToWin = detect.waysToWin(mark)
        if (waysToWin.length) {
            return waysToWin[0]
        }

        // If your opponent can win, block them.
        var opponentsMark = mark === X ? O : X
        var cellsToBlock = detect.waysToWin(opponentsMark)
        if (cellsToBlock.length) {
            return cellsToBlock[0]
        }

        // Detect children that are forks
        // Create fork if possible.
        var children = detect.children(mark)
        var detectChildFork = detect.childIsFork.bind(null, mark)
        var forks = children.filter(detectChildFork)
        if (forks.length) {
            return forks[0].path
        }

        // Block opponent's chance to fork
        // Preferably as aggressively as possible.
        var opponentsChildren = detect.children(opponentsMark)
        var detectOpponentChildFork = detect.childIsFork
                                        .bind(null, opponentsMark)
        var opponentsForks = children.filter(detectOpponentChildFork)
        if (opponentsForks.length) {
            return opponentForks[0].path
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

module.exports = AI