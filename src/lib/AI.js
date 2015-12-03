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
        var isEmpty = detect.isEmpty()
        if (isEmpty) {
            return 0
        } 
        var waysToWin = detect.waysToWin(mark)
        if (waysToWin.length) {
            return waysToWin[0]
        }
        var opponentMark = mark === X ? O : X
        var cellsToBlock = detect.waysToWin(opponentMark)
        if (cellsToBlock.length) {
            console.log('blocking opponent 2-in-a-row')
            return cellsToBlock[0]
        }
        var children = detect.children(mark)
        var childrenDetects = children.map(D)
        return randomChoice()
    }

    return bestChoice()
}

module.exports = AI