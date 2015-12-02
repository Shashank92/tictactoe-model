var Promise = require('bluebird')
var D = require('./detect')
Object.assign(global, require('./constants'))
Object.assign(global, require('./util'))

function AI(grid, mark) {
    assertGridExists(grid)
    var opponentsMark = mark === X ? O : X
    var detect = D(grid)
    var isEmpty = detect.isEmpty()
    var freeSpaces = detect.freeSpaces()
    var waysToWin = detect.waysToWin(mark)

    function randomChoice() {
        var randomIndex = Math.floor(Math.random() * freeSpaces.length)
        return Promise.resolve(freeSpaces[randomIndex])
    }

    return randomChoice()
}

module.exports = AI