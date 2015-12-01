var constants = require('./constants')
var D = require('./detect')

function markSpace(mark, grid, index) {
    var FREE_SPACE = constants.FREE_SPACE
    if (grid[index] === FREE_SPACE) {
        return  grid.substr(0, index)
                + mark
                + grid.substr(index + 1)
    } else {
        throw new Error('The AI is attempting to mark a marked space.')
    }
}

function AI() {}

AI.prototype.markRandom = function(mark, grid) {
    var freeSpaces = D.detectFreeSpaces(grid)
    var randomChoice = Math.floor(Math.random() * freeSpaces.length)
    return markSpace(mark, grid, freeSpaces[randomChoice])
}

AI.prototype.markBest = function(mark, grid) {
    return this.markRandom(mark, grid)
}

module.exports = AI