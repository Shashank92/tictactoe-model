require('./lib/polyfill')
var D = require('./lib/detect')
var AI = require('./lib/AI')
Object.assign(global, require('./lib/constants'))

function playerVsAIGame(playerMark) {
    playerMark = playerMark || X
    var AIMark = playerMark === X ? O : X
    var grid = FREE_SPACE.repeat(9)
    // To be decided upon.
    var winningRow
    var winner

    function getPlayerMark() {
        return playerMark
    }

   function getAIMark() {
        return AIMark
    }

    function getGrid() {
        return grid
    }

    function markCell(mark, index) {
        if (grid[index] === FREE_SPACE) {
            grid =  grid.substr(0, index)
                    + mark
                    + grid.substr(index + 1)
        } else {
            throw new Error('Attempting to mark an occupied or invalid cell.')
        }
    }

    function gameStateString() {
        var footnote =  winner 
                        ? winner.toUpperCase() + ' wins!'
                        : '\n' + playerMark.toUpperCase() + "'s turn."
        var gridString = grid.replace(/f/g, ' ').toUpperCase()
        return  Array.from({length: 3}, function(v, i) {
                    return i * 3
                }).map(function(i) {
                   return Array.from(gridString.substr(i, 3)).join('|')
                }).join('\n-----\n')
                + '\n' + footnote
    }

    function logGameState() {
        console.log(gameStateString())
        return tttGame
    }

    function yieldToAI() {
        if (winner)
            throw new Error('AI attempting to choose cell after'
                            + ' game has already been decided.')
        var index = AI(AIMark, grid)
        markCell(AIMark, index)
        if (winningRow = D(grid).winningRow(AIMark))
            winner = AIMark
    }

    function chooseCell(index) {
        if (winner)
            throw new Error('Player attempting to choose cell after'
                            + ' game has already been decided.')
        markCell(playerMark, index)
        if (winningRow = D(grid).winningRow(playerMark))
            winner = playerMark
        else
            yieldToAI()
        return tttGame
    }

    if (AIMark === X)
        yieldToAI()

    var tttGame = {
        getPlayerMark: getPlayerMark,
        getAIMark: getAIMark,
        getGrid: getGrid,
        gameStateString: gameStateString,
        logGameState: logGameState,
        chooseCell: chooseCell
    }

    return tttGame
}

module.exports = {
    playerVsAIGame: playerVsAIGame,
    playerXVsAIGame: playerVsAIGame.bind(null, X),
    playerOVsAIGame: playerVsAIGame.bind(null, O)
}