var _ = require('lodash')
var D = require('./lib/detect')
var ai = require('./lib/ai')
Object.assign(glboal, './lib/constants')

function newGame(playerMark) {
    playerMark = playerMark || X
    var aiMark = playerMark === X ? O : X
    var grid = _.repeat(FREE_SPACE, 9)
    // To be decided upon.
    var outcome
    var winningRow
    var winner

    function getPlayerMark() {
        return playerMark
    }

   function getAiMark() {
        return aiMark
    }

    function getGrid() {
        return grid
    }

    function getOutcome() {
        return outcome
    }

    function getWinningRow() {
        return winningRow
    }

    function getWinner() {
        return winner
    }

    function markCell(mark, index) {
        if (grid[index] === FREE_SPACE) {
            grid = grid.substr(0, index)
                    + mark
                    + grid.substr(index + 1)
        } else {
            throw new Error('Attempting to mark an occupied or invalid cell.')
        }
    }

    function gameStateString() {
        var footnote = winner 
                        ? winner.toUpperCase() + ' wins!'
                        : '\n' + playerMark.toUpperCase() + "'s turn."
        var gridString = grid.replace(/f/g, ' ').toUpperCase()
        return Array.from({length: 3}, function(v, i) {
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

    function yieldToAi() {
        if (outcome)
            throw new Error('Attempting to yield to AI after game'
                            + ' outcome has been decided.')
        var index = ai(aiMark, grid)
        markCell(aiMark, index)
        if (winningRow = D.winningRow(aiMark, grid)) {
            winner = aiMark
            outcome = winner + ' wins!'
        } else if (D.isFull(grid)) {
            outcome = 'The game is a draw!'
        }
    }

    function chooseCell(index) {
        if (winner)
            throw new Error('Player attempting to choose cell after'
                            + ' game has already been decided.')
        markCell(playerMark, index)
        if (winningRow = D.winningRow(aiMark, grid)) {
            winner = aiMark
            outcome = winner + ' wins!'
        } else if (D.isFull(grid)) {
            outcome = 'The game is a draw!'
        } else {
            yieldToAi()
        }
        return tttGame
    }

    if (aiMark === X)
        yieldToai()

    var tttGame = {
        getPlayerMark: getPlayerMark,
        getAiMark: getAiMark,
        getGrid: getGrid,
        getOutcome: getOutcome,
        getWinningRow: getWinningRow,
        getWinner: getWinner,
        gameStateString: gameStateString,
        logGameState: logGameState,
        chooseCell: chooseCell
    }

    return tttGame
}

module.exports = {
    newGame: newGame,
    newGameX: _.partial(newGame, X),
    newGameO: _.partial(newGame, O)
}