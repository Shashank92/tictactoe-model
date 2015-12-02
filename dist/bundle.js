(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ttt = require('./src/ttt')

// Browser dump
;(typeof window === 'object' && window !== null ? window : {}).ttt = ttt
},{"./src/ttt":6}],2:[function(require,module,exports){
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
},{"./constants":4,"./detect":5}],3:[function(require,module,exports){
var constants = require('./constants')
var D = require('./detect')

function TicTacToe(ai) {
    if (typeof this !== 'object' || this === null)
        throw new Error('TicTacToe is a constructor and must be called with new')
    this.ai = ai
}

TicTacToe.prototype.startNewGame = function(playerMark, difficulty) {
    var FREE_SPACE = constants.FREE_SPACE
    var X = constants.X
    var O = constants.O
    this.playerMark = playerMark || X
    this.aiMark = this.playerMark === X ? O : X
    this.grid = Array(9).fill(FREE_SPACE).join('')
    this.aiApplyStrategy = (
        !difficulty || difficulty === 'easy'
        ? this.ai.markRandom
        : this.ai.markBest
    ).bind(this.ai)
}

TicTacToe.prototype.yieldToAI = function() {
    this.grid = this.aiApplyStrategy(this.aiMark, this.grid)
}

TicTacToe.prototype.markSpace = function(index) {
    var FREE_SPACE = constants.FREE_SPACE
    var grid = this.grid
    if (grid[index] === FREE_SPACE) {
        this.grid = grid.substr(0, index)
                    + this.playerMark 
                    + grid.substr(index + 1)
    } else {
        throw new Error('The space is either already marked or is not valid.')
    }
}

TicTacToe.prototype.logGridToConsole = function() {
    var grid = this.grid
    if (grid) {
        grid = grid.replace(/f/g, ' ').toUpperCase()
        console.log(
            Array.from({length: 3}, (v, k) => k * 3)
            .map(i => Array.from(grid.substr(i, 3)).join('|'))
            .join('\n-----\n')
        )
    } else {
        throw new Error('The grid is not initialized.')
    }
}

TicTacToe.prototype.detectWin = function(mark) {
    return D.detectWin(mark, this.grid)
}

//* For testing purposes.
TicTacToe.prototype.D = D
//*/

module.exports = TicTacToe
},{"./constants":4,"./detect":5}],4:[function(require,module,exports){
module.exports = {
    FREE_SPACE: 'f',
    X: 'x',
    O: 'o',
    ROWS: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ],
    CORNERS: [0, 2, 6, 8],
    EDGES: [1, 3, 5, 7],
    CENTER: 4,
    OPPOSITE_CORNER: {
        0: 8,
        2: 6,
        6: 2,
        8: 0
    }
}
},{}],5:[function(require,module,exports){
var constants = require('./constants')

function exists(value) {
    return typeof value !== 'undefined' && value !== null
}

function assertMarkExists(mark) {
    if (!exists(mark))
        throw new Error('Mark is undefined or null.')
}

function assertGridExists(grid) {
    if (!exists(grid))
        throw new Error('Grid is undefined or null.') 
}

function checkMark(mark, grid, index) {
    return grid[index] === mark
}

function detectWin(mark, grid) {
    assertMarkExists(mark)
    assertGridExists(grid)
    var ROWS = constants.ROWS
    var spaceIsMine = checkMark.bind(null, mark, grid)
    
    return ROWS.some(function(row) {
        return row.every(spaceIsMine)
    })
}

function detectFreeSpaces(grid) {
    assertGridExists(grid)
    var FREE_SPACE = constants.FREE_SPACE

    return Array.from(grid).reduce(function(freeSpaces, space, index) {
        if (space === FREE_SPACE)
            freeSpaces.push(index)
        return freeSpaces
    }, [])
}

function detectEmpty(grid) {
    assertGridExists(grid)
    return Array.from(grid).every(function(c) {
        return c === 'f'
    })
}

function checkTwoMarked(mark, grid, row) {
    var spaceIsMine = checkMark.bind(null, mark, grid)
    return row.filter(spaceIsMine).length === 2
}

function checkFreeSpace(grid, index) {
    return grid[index] === constants.FREE_SPACE
}

function detectWaysToWin(mark, grid) {
    assertMarkExists(mark)
    assertGridExists(grid)
    var ROWS = constants.ROWS
    var twoSpacesAreMine = checkTwoMarked.bind(null, mark, grid)
    var spaceIsFree = checkFreeSpace.bind(null, grid)

    return ROWS.filter(twoSpacesAreMine).map(function(row) {
        return row.filter(spaceIsFree)
    }).filter(function(spaceNotMarkedInRow) {
        return spaceNotMarkedInRow.length
    }).map(function(winningIndex) {
        return winningIndex[0]
    })
}

module.exports = {
    detectWin: detectWin,
    detectFreeSpaces: detectFreeSpaces,
    detectEmpty: detectEmpty,
    detectWaysToWin: detectWaysToWin
}
},{"./constants":4}],6:[function(require,module,exports){
var TicTacToe = require('./lib/TicTacToe')
var AI = require('./lib/AI')

var ttt = new TicTacToe(new AI())

module.exports = ttt
},{"./lib/AI":2,"./lib/TicTacToe":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC5qcyIsInNyYy9saWIvQUkuanMiLCJzcmMvbGliL1RpY1RhY1RvZS5qcyIsInNyYy9saWIvY29uc3RhbnRzLmpzIiwic3JjL2xpYi9kZXRlY3QuanMiLCJzcmMvdHR0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgdHR0ID0gcmVxdWlyZSgnLi9zcmMvdHR0JylcblxuLy8gQnJvd3NlciBkdW1wXG47KHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHdpbmRvdyAhPT0gbnVsbCA/IHdpbmRvdyA6IHt9KS50dHQgPSB0dHQiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxudmFyIEQgPSByZXF1aXJlKCcuL2RldGVjdCcpXG5cbmZ1bmN0aW9uIG1hcmtTcGFjZShtYXJrLCBncmlkLCBpbmRleCkge1xuICAgIHZhciBGUkVFX1NQQUNFID0gY29uc3RhbnRzLkZSRUVfU1BBQ0VcbiAgICBpZiAoZ3JpZFtpbmRleF0gPT09IEZSRUVfU1BBQ0UpIHtcbiAgICAgICAgcmV0dXJuICBncmlkLnN1YnN0cigwLCBpbmRleClcbiAgICAgICAgICAgICAgICArIG1hcmtcbiAgICAgICAgICAgICAgICArIGdyaWQuc3Vic3RyKGluZGV4ICsgMSlcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBBSSBpcyBhdHRlbXB0aW5nIHRvIG1hcmsgYSBtYXJrZWQgc3BhY2UuJylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIEFJKCkge31cblxuQUkucHJvdG90eXBlLm1hcmtSYW5kb20gPSBmdW5jdGlvbihtYXJrLCBncmlkKSB7XG4gICAgdmFyIGZyZWVTcGFjZXMgPSBELmRldGVjdEZyZWVTcGFjZXMoZ3JpZClcbiAgICB2YXIgcmFuZG9tQ2hvaWNlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZnJlZVNwYWNlcy5sZW5ndGgpXG4gICAgcmV0dXJuIG1hcmtTcGFjZShtYXJrLCBncmlkLCBmcmVlU3BhY2VzW3JhbmRvbUNob2ljZV0pXG59XG5cbkFJLnByb3RvdHlwZS5tYXJrQmVzdCA9IGZ1bmN0aW9uKG1hcmssIGdyaWQpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrUmFuZG9tKG1hcmssIGdyaWQpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQUkiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxudmFyIEQgPSByZXF1aXJlKCcuL2RldGVjdCcpXG5cbmZ1bmN0aW9uIFRpY1RhY1RvZShhaSkge1xuICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gJ29iamVjdCcgfHwgdGhpcyA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaWNUYWNUb2UgaXMgYSBjb25zdHJ1Y3RvciBhbmQgbXVzdCBiZSBjYWxsZWQgd2l0aCBuZXcnKVxuICAgIHRoaXMuYWkgPSBhaVxufVxuXG5UaWNUYWNUb2UucHJvdG90eXBlLnN0YXJ0TmV3R2FtZSA9IGZ1bmN0aW9uKHBsYXllck1hcmssIGRpZmZpY3VsdHkpIHtcbiAgICB2YXIgRlJFRV9TUEFDRSA9IGNvbnN0YW50cy5GUkVFX1NQQUNFXG4gICAgdmFyIFggPSBjb25zdGFudHMuWFxuICAgIHZhciBPID0gY29uc3RhbnRzLk9cbiAgICB0aGlzLnBsYXllck1hcmsgPSBwbGF5ZXJNYXJrIHx8IFhcbiAgICB0aGlzLmFpTWFyayA9IHRoaXMucGxheWVyTWFyayA9PT0gWCA/IE8gOiBYXG4gICAgdGhpcy5ncmlkID0gQXJyYXkoOSkuZmlsbChGUkVFX1NQQUNFKS5qb2luKCcnKVxuICAgIHRoaXMuYWlBcHBseVN0cmF0ZWd5ID0gKFxuICAgICAgICAhZGlmZmljdWx0eSB8fCBkaWZmaWN1bHR5ID09PSAnZWFzeSdcbiAgICAgICAgPyB0aGlzLmFpLm1hcmtSYW5kb21cbiAgICAgICAgOiB0aGlzLmFpLm1hcmtCZXN0XG4gICAgKS5iaW5kKHRoaXMuYWkpXG59XG5cblRpY1RhY1RvZS5wcm90b3R5cGUueWllbGRUb0FJID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5ncmlkID0gdGhpcy5haUFwcGx5U3RyYXRlZ3kodGhpcy5haU1hcmssIHRoaXMuZ3JpZClcbn1cblxuVGljVGFjVG9lLnByb3RvdHlwZS5tYXJrU3BhY2UgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHZhciBGUkVFX1NQQUNFID0gY29uc3RhbnRzLkZSRUVfU1BBQ0VcbiAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZFxuICAgIGlmIChncmlkW2luZGV4XSA9PT0gRlJFRV9TUEFDRSkge1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkLnN1YnN0cigwLCBpbmRleClcbiAgICAgICAgICAgICAgICAgICAgKyB0aGlzLnBsYXllck1hcmsgXG4gICAgICAgICAgICAgICAgICAgICsgZ3JpZC5zdWJzdHIoaW5kZXggKyAxKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHNwYWNlIGlzIGVpdGhlciBhbHJlYWR5IG1hcmtlZCBvciBpcyBub3QgdmFsaWQuJylcbiAgICB9XG59XG5cblRpY1RhY1RvZS5wcm90b3R5cGUubG9nR3JpZFRvQ29uc29sZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBncmlkID0gdGhpcy5ncmlkXG4gICAgaWYgKGdyaWQpIHtcbiAgICAgICAgZ3JpZCA9IGdyaWQucmVwbGFjZSgvZi9nLCAnICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBBcnJheS5mcm9tKHtsZW5ndGg6IDN9LCAodiwgaykgPT4gayAqIDMpXG4gICAgICAgICAgICAubWFwKGkgPT4gQXJyYXkuZnJvbShncmlkLnN1YnN0cihpLCAzKSkuam9pbignfCcpKVxuICAgICAgICAgICAgLmpvaW4oJ1xcbi0tLS0tXFxuJylcbiAgICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGdyaWQgaXMgbm90IGluaXRpYWxpemVkLicpXG4gICAgfVxufVxuXG5UaWNUYWNUb2UucHJvdG90eXBlLmRldGVjdFdpbiA9IGZ1bmN0aW9uKG1hcmspIHtcbiAgICByZXR1cm4gRC5kZXRlY3RXaW4obWFyaywgdGhpcy5ncmlkKVxufVxuXG4vLyogRm9yIHRlc3RpbmcgcHVycG9zZXMuXG5UaWNUYWNUb2UucHJvdG90eXBlLkQgPSBEXG4vLyovXG5cbm1vZHVsZS5leHBvcnRzID0gVGljVGFjVG9lIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgRlJFRV9TUEFDRTogJ2YnLFxuICAgIFg6ICd4JyxcbiAgICBPOiAnbycsXG4gICAgUk9XUzogW1xuICAgICAgICBbMCwgMSwgMl0sXG4gICAgICAgIFszLCA0LCA1XSxcbiAgICAgICAgWzYsIDcsIDhdLFxuICAgICAgICBbMCwgMywgNl0sXG4gICAgICAgIFsxLCA0LCA3XSxcbiAgICAgICAgWzIsIDUsIDhdLFxuICAgICAgICBbMCwgNCwgOF0sXG4gICAgICAgIFsyLCA0LCA2XVxuICAgIF0sXG4gICAgQ09STkVSUzogWzAsIDIsIDYsIDhdLFxuICAgIEVER0VTOiBbMSwgMywgNSwgN10sXG4gICAgQ0VOVEVSOiA0LFxuICAgIE9QUE9TSVRFX0NPUk5FUjoge1xuICAgICAgICAwOiA4LFxuICAgICAgICAyOiA2LFxuICAgICAgICA2OiAyLFxuICAgICAgICA4OiAwXG4gICAgfVxufSIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpXG5cbmZ1bmN0aW9uIGV4aXN0cyh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsXG59XG5cbmZ1bmN0aW9uIGFzc2VydE1hcmtFeGlzdHMobWFyaykge1xuICAgIGlmICghZXhpc3RzKG1hcmspKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hcmsgaXMgdW5kZWZpbmVkIG9yIG51bGwuJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0R3JpZEV4aXN0cyhncmlkKSB7XG4gICAgaWYgKCFleGlzdHMoZ3JpZCkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignR3JpZCBpcyB1bmRlZmluZWQgb3IgbnVsbC4nKSBcbn1cblxuZnVuY3Rpb24gY2hlY2tNYXJrKG1hcmssIGdyaWQsIGluZGV4KSB7XG4gICAgcmV0dXJuIGdyaWRbaW5kZXhdID09PSBtYXJrXG59XG5cbmZ1bmN0aW9uIGRldGVjdFdpbihtYXJrLCBncmlkKSB7XG4gICAgYXNzZXJ0TWFya0V4aXN0cyhtYXJrKVxuICAgIGFzc2VydEdyaWRFeGlzdHMoZ3JpZClcbiAgICB2YXIgUk9XUyA9IGNvbnN0YW50cy5ST1dTXG4gICAgdmFyIHNwYWNlSXNNaW5lID0gY2hlY2tNYXJrLmJpbmQobnVsbCwgbWFyaywgZ3JpZClcbiAgICBcbiAgICByZXR1cm4gUk9XUy5zb21lKGZ1bmN0aW9uKHJvdykge1xuICAgICAgICByZXR1cm4gcm93LmV2ZXJ5KHNwYWNlSXNNaW5lKVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGRldGVjdEZyZWVTcGFjZXMoZ3JpZCkge1xuICAgIGFzc2VydEdyaWRFeGlzdHMoZ3JpZClcbiAgICB2YXIgRlJFRV9TUEFDRSA9IGNvbnN0YW50cy5GUkVFX1NQQUNFXG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShncmlkKS5yZWR1Y2UoZnVuY3Rpb24oZnJlZVNwYWNlcywgc3BhY2UsIGluZGV4KSB7XG4gICAgICAgIGlmIChzcGFjZSA9PT0gRlJFRV9TUEFDRSlcbiAgICAgICAgICAgIGZyZWVTcGFjZXMucHVzaChpbmRleClcbiAgICAgICAgcmV0dXJuIGZyZWVTcGFjZXNcbiAgICB9LCBbXSlcbn1cblxuZnVuY3Rpb24gZGV0ZWN0RW1wdHkoZ3JpZCkge1xuICAgIGFzc2VydEdyaWRFeGlzdHMoZ3JpZClcbiAgICByZXR1cm4gQXJyYXkuZnJvbShncmlkKS5ldmVyeShmdW5jdGlvbihjKSB7XG4gICAgICAgIHJldHVybiBjID09PSAnZidcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjaGVja1R3b01hcmtlZChtYXJrLCBncmlkLCByb3cpIHtcbiAgICB2YXIgc3BhY2VJc01pbmUgPSBjaGVja01hcmsuYmluZChudWxsLCBtYXJrLCBncmlkKVxuICAgIHJldHVybiByb3cuZmlsdGVyKHNwYWNlSXNNaW5lKS5sZW5ndGggPT09IDJcbn1cblxuZnVuY3Rpb24gY2hlY2tGcmVlU3BhY2UoZ3JpZCwgaW5kZXgpIHtcbiAgICByZXR1cm4gZ3JpZFtpbmRleF0gPT09IGNvbnN0YW50cy5GUkVFX1NQQUNFXG59XG5cbmZ1bmN0aW9uIGRldGVjdFdheXNUb1dpbihtYXJrLCBncmlkKSB7XG4gICAgYXNzZXJ0TWFya0V4aXN0cyhtYXJrKVxuICAgIGFzc2VydEdyaWRFeGlzdHMoZ3JpZClcbiAgICB2YXIgUk9XUyA9IGNvbnN0YW50cy5ST1dTXG4gICAgdmFyIHR3b1NwYWNlc0FyZU1pbmUgPSBjaGVja1R3b01hcmtlZC5iaW5kKG51bGwsIG1hcmssIGdyaWQpXG4gICAgdmFyIHNwYWNlSXNGcmVlID0gY2hlY2tGcmVlU3BhY2UuYmluZChudWxsLCBncmlkKVxuXG4gICAgcmV0dXJuIFJPV1MuZmlsdGVyKHR3b1NwYWNlc0FyZU1pbmUpLm1hcChmdW5jdGlvbihyb3cpIHtcbiAgICAgICAgcmV0dXJuIHJvdy5maWx0ZXIoc3BhY2VJc0ZyZWUpXG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uKHNwYWNlTm90TWFya2VkSW5Sb3cpIHtcbiAgICAgICAgcmV0dXJuIHNwYWNlTm90TWFya2VkSW5Sb3cubGVuZ3RoXG4gICAgfSkubWFwKGZ1bmN0aW9uKHdpbm5pbmdJbmRleCkge1xuICAgICAgICByZXR1cm4gd2lubmluZ0luZGV4WzBdXG4gICAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGV0ZWN0V2luOiBkZXRlY3RXaW4sXG4gICAgZGV0ZWN0RnJlZVNwYWNlczogZGV0ZWN0RnJlZVNwYWNlcyxcbiAgICBkZXRlY3RFbXB0eTogZGV0ZWN0RW1wdHksXG4gICAgZGV0ZWN0V2F5c1RvV2luOiBkZXRlY3RXYXlzVG9XaW5cbn0iLCJ2YXIgVGljVGFjVG9lID0gcmVxdWlyZSgnLi9saWIvVGljVGFjVG9lJylcbnZhciBBSSA9IHJlcXVpcmUoJy4vbGliL0FJJylcblxudmFyIHR0dCA9IG5ldyBUaWNUYWNUb2UobmV3IEFJKCkpXG5cbm1vZHVsZS5leHBvcnRzID0gdHR0Il19
