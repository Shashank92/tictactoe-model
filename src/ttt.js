var Promise = require('bluebird')
var D = require('./lib/detect')
var AI = require('./lib/AI')
Object.assign(global, require('./lib/constants'))

function playerVsAI(playerMark) {
    var AIMark = playerMark === X ? O : X
    var grid = FREE_SPACE.repeat(9)

    function getPlayerMark() {
        return playerMark
    }

   function getAIMark() {
        return AIMark
    }

    function getGrid() {
        return grid
    }

    function gridToString() {
        grid = grid.replace(/f/g, ' ').toUpperCase()
        return  Array.from({length: 3}, function(v, k) {
                    return k * 3
                }).map(function(i) {
                   return Array.from(grid.substr(i, 3)).join('|')
                }).join('\n-----\n')
    }

    function markCell(mark, index) {
        if (grid[index] === FREE_SPACE) {
            grid = grid.substr(0, index)
                    + playerMark 
                    + grid.substr(index + 1)
        } else {
            throw new Error('Attempting to mark an occupied or invalid cell.')
        }
    }

    function yieldToPlayer() {
        new Promise(function(resolve) {
            chooseCell = resolve
        }).then(function(index) {
            markCell(playerMark, index)
            yieldToAI()
        }).catch(console.error.bind(console))
    }

    function yieldToAI() {
        AI(grid, AIMark).then(function(index) {
            console.log('AI finished move bwahaha')
            markCell(AIMark, index)
            yieldToPlayer()
        }).catch(console.error.bind(console))
    }


    if (playerMark === X)
        yieldToPlayer()
    else
        yieldToAI()

    var chooseCell

    return {
        getPlayerMark: getPlayerMark,
        getAIMark: getAIMark,
        getGrid: getGrid,
        chooseCell: chooseCell,
        gridToString: gridToString
    }
}

module.exports = {
    playerVsAI: playerVsAI,
    playerXVsAI: playerVsAI.bind(null, X),
    playerOVsAI: playerVsAI.bind(null, O)
}