var D = require('./detect')
Object.assign(global, require('./constants'))
Object.assign(global, require('./util'))

function AI(mark, grid) {
    assertGridExists(grid)
    assertMarkExists(mark)
    var detect = D(grid)
    var freeSpaces = detect.freeSpaces()

    function randomChoice() {
        var randomIndex = Math.floor(Math.random() * freeSpaces.length)
        return freeSpaces[randomIndex]
    }

    function bestChoice() {
        var opponentsMark = mark === X ? O : X
        var isEmpty = detect.isEmpty()
        var waysToWin = detect.waysToWin(mark)
        var children = detect.children(mark)
        if (isEmpty) {
            return 0
        } else if (waysToWin.length) {
            return waysToWin[0]
        }
        return randomChoice()
    }

    return bestChoice()
}

module.exports = AI