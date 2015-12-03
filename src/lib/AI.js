var D = require('./detect')
Object.assign(global, require('./constants'))
Object.assign(global, require('./util'))

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
        var opponentMark = mark === X ? O : X
        var cellsToBlock = detect.waysToWin(opponentMark)
        if (cellsToBlock.length) {
            console.log('blocking opponent 2-in-a-row')
            return cellsToBlock[0]
        }

        // Detect children that are forks
        // Create fork if possible.
        var children = detect.children(mark)
        var forks = children.filter(detect.childIsFork.bind(null, mark))
        if (forks.length)
            return forks[0].path

        // Block opponent's chance to fork
        // Preferably as aggressively as possible.
        return randomChoice()
    }

    return bestChoice()
}

module.exports = AI