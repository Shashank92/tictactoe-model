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
    this.grid = FREE_SPACE.repeat(9)
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
    var FREE_SPACE = constants.FREE_SPACE
    return Array.from(grid).every(function(c) {
        return c === FREE_SPACE
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
        return row.find(spaceIsFree)
    }).filter(exists)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC5qcyIsInNyYy9saWIvQUkuanMiLCJzcmMvbGliL1RpY1RhY1RvZS5qcyIsInNyYy9saWIvY29uc3RhbnRzLmpzIiwic3JjL2xpYi9kZXRlY3QuanMiLCJzcmMvdHR0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgdHR0ID0gcmVxdWlyZSgnLi9zcmMvdHR0JylcblxuLy8gQnJvd3NlciBkdW1wXG47KHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHdpbmRvdyAhPT0gbnVsbCA/IHdpbmRvdyA6IHt9KS50dHQgPSB0dHQiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxudmFyIEQgPSByZXF1aXJlKCcuL2RldGVjdCcpXG5cbmZ1bmN0aW9uIG1hcmtTcGFjZShtYXJrLCBncmlkLCBpbmRleCkge1xuICAgIHZhciBGUkVFX1NQQUNFID0gY29uc3RhbnRzLkZSRUVfU1BBQ0VcbiAgICBpZiAoZ3JpZFtpbmRleF0gPT09IEZSRUVfU1BBQ0UpIHtcbiAgICAgICAgcmV0dXJuICBncmlkLnN1YnN0cigwLCBpbmRleClcbiAgICAgICAgICAgICAgICArIG1hcmtcbiAgICAgICAgICAgICAgICArIGdyaWQuc3Vic3RyKGluZGV4ICsgMSlcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBBSSBpcyBhdHRlbXB0aW5nIHRvIG1hcmsgYSBtYXJrZWQgc3BhY2UuJylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIEFJKCkge31cblxuQUkucHJvdG90eXBlLm1hcmtSYW5kb20gPSBmdW5jdGlvbihtYXJrLCBncmlkKSB7XG4gICAgdmFyIGZyZWVTcGFjZXMgPSBELmRldGVjdEZyZWVTcGFjZXMoZ3JpZClcbiAgICB2YXIgcmFuZG9tQ2hvaWNlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZnJlZVNwYWNlcy5sZW5ndGgpXG4gICAgcmV0dXJuIG1hcmtTcGFjZShtYXJrLCBncmlkLCBmcmVlU3BhY2VzW3JhbmRvbUNob2ljZV0pXG59XG5cbkFJLnByb3RvdHlwZS5tYXJrQmVzdCA9IGZ1bmN0aW9uKG1hcmssIGdyaWQpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrUmFuZG9tKG1hcmssIGdyaWQpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQUkiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxudmFyIEQgPSByZXF1aXJlKCcuL2RldGVjdCcpXG5cbmZ1bmN0aW9uIFRpY1RhY1RvZShhaSkge1xuICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gJ29iamVjdCcgfHwgdGhpcyA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaWNUYWNUb2UgaXMgYSBjb25zdHJ1Y3RvciBhbmQgbXVzdCBiZSBjYWxsZWQgd2l0aCBuZXcnKVxuICAgIHRoaXMuYWkgPSBhaVxufVxuXG5UaWNUYWNUb2UucHJvdG90eXBlLnN0YXJ0TmV3R2FtZSA9IGZ1bmN0aW9uKHBsYXllck1hcmssIGRpZmZpY3VsdHkpIHtcbiAgICB2YXIgRlJFRV9TUEFDRSA9IGNvbnN0YW50cy5GUkVFX1NQQUNFXG4gICAgdmFyIFggPSBjb25zdGFudHMuWFxuICAgIHZhciBPID0gY29uc3RhbnRzLk9cbiAgICB0aGlzLnBsYXllck1hcmsgPSBwbGF5ZXJNYXJrIHx8IFhcbiAgICB0aGlzLmFpTWFyayA9IHRoaXMucGxheWVyTWFyayA9PT0gWCA/IE8gOiBYXG4gICAgdGhpcy5ncmlkID0gRlJFRV9TUEFDRS5yZXBlYXQoOSlcbiAgICB0aGlzLmFpQXBwbHlTdHJhdGVneSA9IChcbiAgICAgICAgIWRpZmZpY3VsdHkgfHwgZGlmZmljdWx0eSA9PT0gJ2Vhc3knXG4gICAgICAgID8gdGhpcy5haS5tYXJrUmFuZG9tXG4gICAgICAgIDogdGhpcy5haS5tYXJrQmVzdFxuICAgICkuYmluZCh0aGlzLmFpKVxufVxuXG5UaWNUYWNUb2UucHJvdG90eXBlLnlpZWxkVG9BSSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ3JpZCA9IHRoaXMuYWlBcHBseVN0cmF0ZWd5KHRoaXMuYWlNYXJrLCB0aGlzLmdyaWQpXG59XG5cblRpY1RhY1RvZS5wcm90b3R5cGUubWFya1NwYWNlID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICB2YXIgRlJFRV9TUEFDRSA9IGNvbnN0YW50cy5GUkVFX1NQQUNFXG4gICAgdmFyIGdyaWQgPSB0aGlzLmdyaWRcbiAgICBpZiAoZ3JpZFtpbmRleF0gPT09IEZSRUVfU1BBQ0UpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gZ3JpZC5zdWJzdHIoMCwgaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICsgdGhpcy5wbGF5ZXJNYXJrIFxuICAgICAgICAgICAgICAgICAgICArIGdyaWQuc3Vic3RyKGluZGV4ICsgMSlcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzcGFjZSBpcyBlaXRoZXIgYWxyZWFkeSBtYXJrZWQgb3IgaXMgbm90IHZhbGlkLicpXG4gICAgfVxufVxuXG5UaWNUYWNUb2UucHJvdG90eXBlLmxvZ0dyaWRUb0NvbnNvbGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZFxuICAgIGlmIChncmlkKSB7XG4gICAgICAgIGdyaWQgPSBncmlkLnJlcGxhY2UoL2YvZywgJyAnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgQXJyYXkuZnJvbSh7bGVuZ3RoOiAzfSwgKHYsIGspID0+IGsgKiAzKVxuICAgICAgICAgICAgLm1hcChpID0+IEFycmF5LmZyb20oZ3JpZC5zdWJzdHIoaSwgMykpLmpvaW4oJ3wnKSlcbiAgICAgICAgICAgIC5qb2luKCdcXG4tLS0tLVxcbicpXG4gICAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBncmlkIGlzIG5vdCBpbml0aWFsaXplZC4nKVxuICAgIH1cbn1cblxuVGljVGFjVG9lLnByb3RvdHlwZS5kZXRlY3RXaW4gPSBmdW5jdGlvbihtYXJrKSB7XG4gICAgcmV0dXJuIEQuZGV0ZWN0V2luKG1hcmssIHRoaXMuZ3JpZClcbn1cblxuLy8qIEZvciB0ZXN0aW5nIHB1cnBvc2VzLlxuVGljVGFjVG9lLnByb3RvdHlwZS5EID0gRFxuLy8qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpY1RhY1RvZSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEZSRUVfU1BBQ0U6ICdmJyxcbiAgICBYOiAneCcsXG4gICAgTzogJ28nLFxuICAgIFJPV1M6IFtcbiAgICAgICAgWzAsIDEsIDJdLFxuICAgICAgICBbMywgNCwgNV0sXG4gICAgICAgIFs2LCA3LCA4XSxcbiAgICAgICAgWzAsIDMsIDZdLFxuICAgICAgICBbMSwgNCwgN10sXG4gICAgICAgIFsyLCA1LCA4XSxcbiAgICAgICAgWzAsIDQsIDhdLFxuICAgICAgICBbMiwgNCwgNl1cbiAgICBdLFxuICAgIENPUk5FUlM6IFswLCAyLCA2LCA4XSxcbiAgICBFREdFUzogWzEsIDMsIDUsIDddLFxuICAgIENFTlRFUjogNCxcbiAgICBPUFBPU0lURV9DT1JORVI6IHtcbiAgICAgICAgMDogOCxcbiAgICAgICAgMjogNixcbiAgICAgICAgNjogMixcbiAgICAgICAgODogMFxuICAgIH1cbn0iLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxuXG5mdW5jdGlvbiBleGlzdHModmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSAhPT0gbnVsbFxufVxuXG5mdW5jdGlvbiBhc3NlcnRNYXJrRXhpc3RzKG1hcmspIHtcbiAgICBpZiAoIWV4aXN0cyhtYXJrKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYXJrIGlzIHVuZGVmaW5lZCBvciBudWxsLicpXG59XG5cbmZ1bmN0aW9uIGFzc2VydEdyaWRFeGlzdHMoZ3JpZCkge1xuICAgIGlmICghZXhpc3RzKGdyaWQpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dyaWQgaXMgdW5kZWZpbmVkIG9yIG51bGwuJykgXG59XG5cbmZ1bmN0aW9uIGNoZWNrTWFyayhtYXJrLCBncmlkLCBpbmRleCkge1xuICAgIHJldHVybiBncmlkW2luZGV4XSA9PT0gbWFya1xufVxuXG5mdW5jdGlvbiBkZXRlY3RXaW4obWFyaywgZ3JpZCkge1xuICAgIGFzc2VydE1hcmtFeGlzdHMobWFyaylcbiAgICBhc3NlcnRHcmlkRXhpc3RzKGdyaWQpXG4gICAgdmFyIFJPV1MgPSBjb25zdGFudHMuUk9XU1xuICAgIHZhciBzcGFjZUlzTWluZSA9IGNoZWNrTWFyay5iaW5kKG51bGwsIG1hcmssIGdyaWQpXG5cbiAgICByZXR1cm4gUk9XUy5zb21lKGZ1bmN0aW9uKHJvdykge1xuICAgICAgICByZXR1cm4gcm93LmV2ZXJ5KHNwYWNlSXNNaW5lKVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGRldGVjdEZyZWVTcGFjZXMoZ3JpZCkge1xuICAgIGFzc2VydEdyaWRFeGlzdHMoZ3JpZClcbiAgICB2YXIgRlJFRV9TUEFDRSA9IGNvbnN0YW50cy5GUkVFX1NQQUNFXG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShncmlkKS5yZWR1Y2UoZnVuY3Rpb24oZnJlZVNwYWNlcywgc3BhY2UsIGluZGV4KSB7XG4gICAgICAgIGlmIChzcGFjZSA9PT0gRlJFRV9TUEFDRSlcbiAgICAgICAgICAgIGZyZWVTcGFjZXMucHVzaChpbmRleClcbiAgICAgICAgcmV0dXJuIGZyZWVTcGFjZXNcbiAgICB9LCBbXSlcbn1cblxuZnVuY3Rpb24gZGV0ZWN0RW1wdHkoZ3JpZCkge1xuICAgIGFzc2VydEdyaWRFeGlzdHMoZ3JpZClcbiAgICB2YXIgRlJFRV9TUEFDRSA9IGNvbnN0YW50cy5GUkVFX1NQQUNFXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZ3JpZCkuZXZlcnkoZnVuY3Rpb24oYykge1xuICAgICAgICByZXR1cm4gYyA9PT0gRlJFRV9TUEFDRVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNoZWNrVHdvTWFya2VkKG1hcmssIGdyaWQsIHJvdykge1xuICAgIHZhciBzcGFjZUlzTWluZSA9IGNoZWNrTWFyay5iaW5kKG51bGwsIG1hcmssIGdyaWQpXG4gICAgcmV0dXJuIHJvdy5maWx0ZXIoc3BhY2VJc01pbmUpLmxlbmd0aCA9PT0gMlxufVxuXG5mdW5jdGlvbiBjaGVja0ZyZWVTcGFjZShncmlkLCBpbmRleCkge1xuICAgIHJldHVybiBncmlkW2luZGV4XSA9PT0gY29uc3RhbnRzLkZSRUVfU1BBQ0Vcbn1cblxuZnVuY3Rpb24gZGV0ZWN0V2F5c1RvV2luKG1hcmssIGdyaWQpIHtcbiAgICBhc3NlcnRNYXJrRXhpc3RzKG1hcmspXG4gICAgYXNzZXJ0R3JpZEV4aXN0cyhncmlkKVxuICAgIHZhciBST1dTID0gY29uc3RhbnRzLlJPV1NcbiAgICB2YXIgdHdvU3BhY2VzQXJlTWluZSA9IGNoZWNrVHdvTWFya2VkLmJpbmQobnVsbCwgbWFyaywgZ3JpZClcbiAgICB2YXIgc3BhY2VJc0ZyZWUgPSBjaGVja0ZyZWVTcGFjZS5iaW5kKG51bGwsIGdyaWQpXG5cbiAgICByZXR1cm4gUk9XUy5maWx0ZXIodHdvU3BhY2VzQXJlTWluZSkubWFwKGZ1bmN0aW9uKHJvdykge1xuICAgICAgICByZXR1cm4gcm93LmZpbmQoc3BhY2VJc0ZyZWUpXG4gICAgfSkuZmlsdGVyKGV4aXN0cylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGV0ZWN0V2luOiBkZXRlY3RXaW4sXG4gICAgZGV0ZWN0RnJlZVNwYWNlczogZGV0ZWN0RnJlZVNwYWNlcyxcbiAgICBkZXRlY3RFbXB0eTogZGV0ZWN0RW1wdHksXG4gICAgZGV0ZWN0V2F5c1RvV2luOiBkZXRlY3RXYXlzVG9XaW5cbn0iLCJ2YXIgVGljVGFjVG9lID0gcmVxdWlyZSgnLi9saWIvVGljVGFjVG9lJylcbnZhciBBSSA9IHJlcXVpcmUoJy4vbGliL0FJJylcblxudmFyIHR0dCA9IG5ldyBUaWNUYWNUb2UobmV3IEFJKCkpXG5cbm1vZHVsZS5leHBvcnRzID0gdHR0Il19
