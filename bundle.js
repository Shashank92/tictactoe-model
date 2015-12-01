(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./constants":3,"./detect":4}],2:[function(require,module,exports){
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
    this.aiApplyStrategy = (
        !difficulty || difficulty === 'easy'
        ? this.ai.markRandom
        : this.ai.markBest
    ).bind(this.ai)
    this.playerMark = playerMark || X
    this.aiMark = this.playerMark === X ? O : X
    this.grid = Array(9).fill(FREE_SPACE).join('')
    if (this.aiMark === X)
        this.yieldToAI()
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

module.exports = TicTacToe
},{"./constants":3,"./detect":4}],3:[function(require,module,exports){
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
    SIDES: [1, 3, 5, 7],
    CORNERS: [0, 2, 6, 8],
    CENTER: 4,
    OPPOSITE_CORNER: {
        0: 8,
        2: 6,
        6: 2,
        8: 0
    }
}
},{}],4:[function(require,module,exports){
var constants = require('./constants')

function assertGridExists(grid) {
    if (typeof grid === 'undefined' || grid === null)
        throw new Error('Grid is not initialized.') 
}

function marked(mark, grid, index) {
    return mark === grid[index]
}

function twoConsecutive(predicate, array) {
    var last = false
    for (var i = 0, n = array.length; i < n; i++) {
        var value = array[i]
        var current = predicate(value)
        if (last && current)
            return true
        else
            last = current
    }
}

function detectWin(mark, grid) {
    assertGridExists(grid)
    var ROWS = constants.ROWS
    var spaceIsMine = marked.bind(null, mark, grid)
    return ROWS.some(function(row) {
        return row.every(spaceIsMine)
    })
}

function detectTwoInARow(mark, grid) {
    assertGridExists(grid)
    var ROWS = constants.ROWS
    var spaceIsMine = marked.bind(null, mark, grid)
    for (var i = 0, n = ROWS.length; i < n; i++) {
        var row = ROWS[i]
        if (twoConsecutive(spaceIsMine, row))
            return row
    }
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

module.exports = {
    detectWin: detectWin,
    detectTwoInARow: detectTwoInARow,
    detectFreeSpaces: detectFreeSpaces
}
},{"./constants":3}],5:[function(require,module,exports){
(function (global){
var TicTacToe = require('./lib/TicTacToe')
var AI = require('./lib/AI')

var ttt = new TicTacToe(new AI())

//* For testing purposes
;(  typeof global ===  'object' ? global :
    typeof window === 'object' ? window :
    typeof self === 'object' ? self :
    typeof this === 'object' ? this : {}
).ttt = ttt
//*/

module.exports = ttt
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./lib/AI":1,"./lib/TicTacToe":2}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9saWIvQUkuanMiLCJzcmMvbGliL1RpY1RhY1RvZS5qcyIsInNyYy9saWIvY29uc3RhbnRzLmpzIiwic3JjL2xpYi9kZXRlY3QuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxudmFyIEQgPSByZXF1aXJlKCcuL2RldGVjdCcpXG5cbmZ1bmN0aW9uIG1hcmtTcGFjZShtYXJrLCBncmlkLCBpbmRleCkge1xuICAgIHZhciBGUkVFX1NQQUNFID0gY29uc3RhbnRzLkZSRUVfU1BBQ0VcbiAgICBpZiAoZ3JpZFtpbmRleF0gPT09IEZSRUVfU1BBQ0UpIHtcbiAgICAgICAgcmV0dXJuICBncmlkLnN1YnN0cigwLCBpbmRleClcbiAgICAgICAgICAgICAgICArIG1hcmtcbiAgICAgICAgICAgICAgICArIGdyaWQuc3Vic3RyKGluZGV4ICsgMSlcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBBSSBpcyBhdHRlbXB0aW5nIHRvIG1hcmsgYSBtYXJrZWQgc3BhY2UuJylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIEFJKCkge31cblxuQUkucHJvdG90eXBlLm1hcmtSYW5kb20gPSBmdW5jdGlvbihtYXJrLCBncmlkKSB7XG4gICAgdmFyIGZyZWVTcGFjZXMgPSBELmRldGVjdEZyZWVTcGFjZXMoZ3JpZClcbiAgICB2YXIgcmFuZG9tQ2hvaWNlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZnJlZVNwYWNlcy5sZW5ndGgpXG4gICAgcmV0dXJuIG1hcmtTcGFjZShtYXJrLCBncmlkLCBmcmVlU3BhY2VzW3JhbmRvbUNob2ljZV0pXG59XG5cbkFJLnByb3RvdHlwZS5tYXJrQmVzdCA9IGZ1bmN0aW9uKG1hcmssIGdyaWQpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrUmFuZG9tKG1hcmssIGdyaWQpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQUkiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxudmFyIEQgPSByZXF1aXJlKCcuL2RldGVjdCcpXG5cbmZ1bmN0aW9uIFRpY1RhY1RvZShhaSkge1xuICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gJ29iamVjdCcgfHwgdGhpcyA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaWNUYWNUb2UgaXMgYSBjb25zdHJ1Y3RvciBhbmQgbXVzdCBiZSBjYWxsZWQgd2l0aCBuZXcnKVxuICAgIHRoaXMuYWkgPSBhaVxufVxuXG5UaWNUYWNUb2UucHJvdG90eXBlLnN0YXJ0TmV3R2FtZSA9IGZ1bmN0aW9uKHBsYXllck1hcmssIGRpZmZpY3VsdHkpIHtcbiAgICB2YXIgRlJFRV9TUEFDRSA9IGNvbnN0YW50cy5GUkVFX1NQQUNFXG4gICAgdmFyIFggPSBjb25zdGFudHMuWFxuICAgIHZhciBPID0gY29uc3RhbnRzLk9cbiAgICB0aGlzLmFpQXBwbHlTdHJhdGVneSA9IChcbiAgICAgICAgIWRpZmZpY3VsdHkgfHwgZGlmZmljdWx0eSA9PT0gJ2Vhc3knXG4gICAgICAgID8gdGhpcy5haS5tYXJrUmFuZG9tXG4gICAgICAgIDogdGhpcy5haS5tYXJrQmVzdFxuICAgICkuYmluZCh0aGlzLmFpKVxuICAgIHRoaXMucGxheWVyTWFyayA9IHBsYXllck1hcmsgfHwgWFxuICAgIHRoaXMuYWlNYXJrID0gdGhpcy5wbGF5ZXJNYXJrID09PSBYID8gTyA6IFhcbiAgICB0aGlzLmdyaWQgPSBBcnJheSg5KS5maWxsKEZSRUVfU1BBQ0UpLmpvaW4oJycpXG4gICAgaWYgKHRoaXMuYWlNYXJrID09PSBYKVxuICAgICAgICB0aGlzLnlpZWxkVG9BSSgpXG59XG5cblRpY1RhY1RvZS5wcm90b3R5cGUueWllbGRUb0FJID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5ncmlkID0gdGhpcy5haUFwcGx5U3RyYXRlZ3kodGhpcy5haU1hcmssIHRoaXMuZ3JpZClcbn1cblxuVGljVGFjVG9lLnByb3RvdHlwZS5tYXJrU3BhY2UgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHZhciBGUkVFX1NQQUNFID0gY29uc3RhbnRzLkZSRUVfU1BBQ0VcbiAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZFxuICAgIGlmIChncmlkW2luZGV4XSA9PT0gRlJFRV9TUEFDRSkge1xuICAgICAgICB0aGlzLmdyaWQgPSBncmlkLnN1YnN0cigwLCBpbmRleClcbiAgICAgICAgICAgICAgICAgICAgKyB0aGlzLnBsYXllck1hcmsgXG4gICAgICAgICAgICAgICAgICAgICsgZ3JpZC5zdWJzdHIoaW5kZXggKyAxKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHNwYWNlIGlzIGVpdGhlciBhbHJlYWR5IG1hcmtlZCBvciBpcyBub3QgdmFsaWQuJylcbiAgICB9XG59XG5cblRpY1RhY1RvZS5wcm90b3R5cGUubG9nR3JpZFRvQ29uc29sZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBncmlkID0gdGhpcy5ncmlkXG4gICAgaWYgKGdyaWQpIHtcbiAgICAgICAgZ3JpZCA9IGdyaWQucmVwbGFjZSgvZi9nLCAnICcpLnRvVXBwZXJDYXNlKClcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBBcnJheS5mcm9tKHtsZW5ndGg6IDN9LCAodiwgaykgPT4gayAqIDMpXG4gICAgICAgICAgICAubWFwKGkgPT4gQXJyYXkuZnJvbShncmlkLnN1YnN0cihpLCAzKSkuam9pbignfCcpKVxuICAgICAgICAgICAgLmpvaW4oJ1xcbi0tLS0tXFxuJylcbiAgICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGdyaWQgaXMgbm90IGluaXRpYWxpemVkLicpXG4gICAgfVxufVxuXG5UaWNUYWNUb2UucHJvdG90eXBlLmRldGVjdFdpbiA9IGZ1bmN0aW9uKG1hcmspIHtcbiAgICByZXR1cm4gRC5kZXRlY3RXaW4obWFyaywgdGhpcy5ncmlkKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpY1RhY1RvZSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEZSRUVfU1BBQ0U6ICdmJyxcbiAgICBYOiAneCcsXG4gICAgTzogJ28nLFxuICAgIFJPV1M6IFtcbiAgICAgICAgWzAsIDEsIDJdLFxuICAgICAgICBbMywgNCwgNV0sXG4gICAgICAgIFs2LCA3LCA4XSxcbiAgICAgICAgWzAsIDMsIDZdLFxuICAgICAgICBbMSwgNCwgN10sXG4gICAgICAgIFsyLCA1LCA4XSxcbiAgICAgICAgWzAsIDQsIDhdLFxuICAgICAgICBbMiwgNCwgNl1cbiAgICBdLFxuICAgIFNJREVTOiBbMSwgMywgNSwgN10sXG4gICAgQ09STkVSUzogWzAsIDIsIDYsIDhdLFxuICAgIENFTlRFUjogNCxcbiAgICBPUFBPU0lURV9DT1JORVI6IHtcbiAgICAgICAgMDogOCxcbiAgICAgICAgMjogNixcbiAgICAgICAgNjogMixcbiAgICAgICAgODogMFxuICAgIH1cbn0iLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxuXG5mdW5jdGlvbiBhc3NlcnRHcmlkRXhpc3RzKGdyaWQpIHtcbiAgICBpZiAodHlwZW9mIGdyaWQgPT09ICd1bmRlZmluZWQnIHx8IGdyaWQgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignR3JpZCBpcyBub3QgaW5pdGlhbGl6ZWQuJykgXG59XG5cbmZ1bmN0aW9uIG1hcmtlZChtYXJrLCBncmlkLCBpbmRleCkge1xuICAgIHJldHVybiBtYXJrID09PSBncmlkW2luZGV4XVxufVxuXG5mdW5jdGlvbiB0d29Db25zZWN1dGl2ZShwcmVkaWNhdGUsIGFycmF5KSB7XG4gICAgdmFyIGxhc3QgPSBmYWxzZVxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldXG4gICAgICAgIHZhciBjdXJyZW50ID0gcHJlZGljYXRlKHZhbHVlKVxuICAgICAgICBpZiAobGFzdCAmJiBjdXJyZW50KVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGFzdCA9IGN1cnJlbnRcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRldGVjdFdpbihtYXJrLCBncmlkKSB7XG4gICAgYXNzZXJ0R3JpZEV4aXN0cyhncmlkKVxuICAgIHZhciBST1dTID0gY29uc3RhbnRzLlJPV1NcbiAgICB2YXIgc3BhY2VJc01pbmUgPSBtYXJrZWQuYmluZChudWxsLCBtYXJrLCBncmlkKVxuICAgIHJldHVybiBST1dTLnNvbWUoZnVuY3Rpb24ocm93KSB7XG4gICAgICAgIHJldHVybiByb3cuZXZlcnkoc3BhY2VJc01pbmUpXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gZGV0ZWN0VHdvSW5BUm93KG1hcmssIGdyaWQpIHtcbiAgICBhc3NlcnRHcmlkRXhpc3RzKGdyaWQpXG4gICAgdmFyIFJPV1MgPSBjb25zdGFudHMuUk9XU1xuICAgIHZhciBzcGFjZUlzTWluZSA9IG1hcmtlZC5iaW5kKG51bGwsIG1hcmssIGdyaWQpXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBST1dTLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICB2YXIgcm93ID0gUk9XU1tpXVxuICAgICAgICBpZiAodHdvQ29uc2VjdXRpdmUoc3BhY2VJc01pbmUsIHJvdykpXG4gICAgICAgICAgICByZXR1cm4gcm93XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZXRlY3RGcmVlU3BhY2VzKGdyaWQpIHtcbiAgICBhc3NlcnRHcmlkRXhpc3RzKGdyaWQpXG4gICAgdmFyIEZSRUVfU1BBQ0UgPSBjb25zdGFudHMuRlJFRV9TUEFDRVxuICAgIHJldHVybiBBcnJheS5mcm9tKGdyaWQpLnJlZHVjZShmdW5jdGlvbihmcmVlU3BhY2VzLCBzcGFjZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKHNwYWNlID09PSBGUkVFX1NQQUNFKVxuICAgICAgICAgICAgZnJlZVNwYWNlcy5wdXNoKGluZGV4KVxuICAgICAgICByZXR1cm4gZnJlZVNwYWNlc1xuICAgIH0sIFtdKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBkZXRlY3RXaW46IGRldGVjdFdpbixcbiAgICBkZXRlY3RUd29JbkFSb3c6IGRldGVjdFR3b0luQVJvdyxcbiAgICBkZXRlY3RGcmVlU3BhY2VzOiBkZXRlY3RGcmVlU3BhY2VzXG59IiwidmFyIFRpY1RhY1RvZSA9IHJlcXVpcmUoJy4vbGliL1RpY1RhY1RvZScpXG52YXIgQUkgPSByZXF1aXJlKCcuL2xpYi9BSScpXG5cbnZhciB0dHQgPSBuZXcgVGljVGFjVG9lKG5ldyBBSSgpKVxuXG4vLyogRm9yIHRlc3RpbmcgcHVycG9zZXNcbjsoICB0eXBlb2YgZ2xvYmFsID09PSAgJ29iamVjdCcgPyBnbG9iYWwgOlxuICAgIHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnID8gd2luZG93IDpcbiAgICB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcgPyBzZWxmIDpcbiAgICB0eXBlb2YgdGhpcyA9PT0gJ29iamVjdCcgPyB0aGlzIDoge31cbikudHR0ID0gdHR0XG4vLyovXG5cbm1vZHVsZS5leHBvcnRzID0gdHR0Il19
