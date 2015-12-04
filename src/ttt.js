var _ = require('lodash')
var D = require('./lib/detect')
var ai = require('./lib/ai')
Object.assign(glboal, './lib/constants')

function playerVsaiGame(playerMark) {
    playerMark = playerMark || X
    var aiMark = playerMark === X ? O : X
    var grid = FREE_SPACE.repeat(9)
    // To be decided upon.
    var winningRow
    var winner

    function getPlayerMark() {
        return playerMark
    }

   function getaiMark() {
        return aiMark
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

    function yieldToai() {
        if (winner)
            throw new Error('ai attempting to choose cell after'
                            + ' game has already been decided.')
        var index = ai(aiMark, grid)
        markCell(aiMark, index)
        if (winningRow = D(grid).winningRow(aiMark))
            winner = aiMark
    }

    function chooseCell(index) {
        if (winner)
            throw new Error('Player attempting to choose cell after'
                            + ' game has already been decided.')
        markCell(playerMark, index)
        if (winningRow = D(grid).winningRow(playerMark))
            winner = playerMark
        else
            yieldToai()
        return tttGame
    }

    if (aiMark === X)
        yieldToai()

    var tttGame = {
        getPlayerMark: getPlayerMark,
        getaiMark: getaiMark,
        getGrid: getGrid,
        gameStateString: gameStateString,
        logGameState: logGameState,
        chooseCell: chooseCell
    }

    return tttGame
}

module.exports = {
    playerVsaiGame: playerVsaiGame,
    playerXVsaiGame: playerVsaiGame.bind(null, X),
    playerOVsaiGame: playerVsaiGame.bind(null, O)
}