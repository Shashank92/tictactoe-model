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
},{"./constants":4}],6:[function(require,module,exports){
var TicTacToe = require('./lib/TicTacToe')
var AI = require('./lib/AI')

var ttt = new TicTacToe(new AI())

module.exports = ttt
},{"./lib/AI":2,"./lib/TicTacToe":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC5qcyIsInNyYy9saWIvQUkuanMiLCJzcmMvbGliL1RpY1RhY1RvZS5qcyIsInNyYy9saWIvY29uc3RhbnRzLmpzIiwic3JjL2xpYi9kZXRlY3QuanMiLCJzcmMvdHR0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHR0dCA9IHJlcXVpcmUoJy4vc3JjL3R0dCcpXG5cbi8vIEJyb3dzZXIgZHVtcFxuOyh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyAmJiB3aW5kb3cgIT09IG51bGwgPyB3aW5kb3cgOiB7fSkudHR0ID0gdHR0IiwidmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJylcbnZhciBEID0gcmVxdWlyZSgnLi9kZXRlY3QnKVxuXG5mdW5jdGlvbiBtYXJrU3BhY2UobWFyaywgZ3JpZCwgaW5kZXgpIHtcbiAgICB2YXIgRlJFRV9TUEFDRSA9IGNvbnN0YW50cy5GUkVFX1NQQUNFXG4gICAgaWYgKGdyaWRbaW5kZXhdID09PSBGUkVFX1NQQUNFKSB7XG4gICAgICAgIHJldHVybiAgZ3JpZC5zdWJzdHIoMCwgaW5kZXgpXG4gICAgICAgICAgICAgICAgKyBtYXJrXG4gICAgICAgICAgICAgICAgKyBncmlkLnN1YnN0cihpbmRleCArIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgQUkgaXMgYXR0ZW1wdGluZyB0byBtYXJrIGEgbWFya2VkIHNwYWNlLicpXG4gICAgfVxufVxuXG5mdW5jdGlvbiBBSSgpIHt9XG5cbkFJLnByb3RvdHlwZS5tYXJrUmFuZG9tID0gZnVuY3Rpb24obWFyaywgZ3JpZCkge1xuICAgIHZhciBmcmVlU3BhY2VzID0gRC5kZXRlY3RGcmVlU3BhY2VzKGdyaWQpXG4gICAgdmFyIHJhbmRvbUNob2ljZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGZyZWVTcGFjZXMubGVuZ3RoKVxuICAgIHJldHVybiBtYXJrU3BhY2UobWFyaywgZ3JpZCwgZnJlZVNwYWNlc1tyYW5kb21DaG9pY2VdKVxufVxuXG5BSS5wcm90b3R5cGUubWFya0Jlc3QgPSBmdW5jdGlvbihtYXJrLCBncmlkKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya1JhbmRvbShtYXJrLCBncmlkKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFJIiwidmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJylcbnZhciBEID0gcmVxdWlyZSgnLi9kZXRlY3QnKVxuXG5mdW5jdGlvbiBUaWNUYWNUb2UoYWkpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnIHx8IHRoaXMgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGljVGFjVG9lIGlzIGEgY29uc3RydWN0b3IgYW5kIG11c3QgYmUgY2FsbGVkIHdpdGggbmV3JylcbiAgICB0aGlzLmFpID0gYWlcbn1cblxuVGljVGFjVG9lLnByb3RvdHlwZS5zdGFydE5ld0dhbWUgPSBmdW5jdGlvbihwbGF5ZXJNYXJrLCBkaWZmaWN1bHR5KSB7XG4gICAgdmFyIEZSRUVfU1BBQ0UgPSBjb25zdGFudHMuRlJFRV9TUEFDRVxuICAgIHZhciBYID0gY29uc3RhbnRzLlhcbiAgICB2YXIgTyA9IGNvbnN0YW50cy5PXG4gICAgdGhpcy5wbGF5ZXJNYXJrID0gcGxheWVyTWFyayB8fCBYXG4gICAgdGhpcy5haU1hcmsgPSB0aGlzLnBsYXllck1hcmsgPT09IFggPyBPIDogWFxuICAgIHRoaXMuZ3JpZCA9IEFycmF5KDkpLmZpbGwoRlJFRV9TUEFDRSkuam9pbignJylcbiAgICB0aGlzLmFpQXBwbHlTdHJhdGVneSA9IChcbiAgICAgICAgIWRpZmZpY3VsdHkgfHwgZGlmZmljdWx0eSA9PT0gJ2Vhc3knXG4gICAgICAgID8gdGhpcy5haS5tYXJrUmFuZG9tXG4gICAgICAgIDogdGhpcy5haS5tYXJrQmVzdFxuICAgICkuYmluZCh0aGlzLmFpKVxufVxuXG5UaWNUYWNUb2UucHJvdG90eXBlLnlpZWxkVG9BSSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ3JpZCA9IHRoaXMuYWlBcHBseVN0cmF0ZWd5KHRoaXMuYWlNYXJrLCB0aGlzLmdyaWQpXG59XG5cblRpY1RhY1RvZS5wcm90b3R5cGUubWFya1NwYWNlID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICB2YXIgRlJFRV9TUEFDRSA9IGNvbnN0YW50cy5GUkVFX1NQQUNFXG4gICAgdmFyIGdyaWQgPSB0aGlzLmdyaWRcbiAgICBpZiAoZ3JpZFtpbmRleF0gPT09IEZSRUVfU1BBQ0UpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gZ3JpZC5zdWJzdHIoMCwgaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICsgdGhpcy5wbGF5ZXJNYXJrIFxuICAgICAgICAgICAgICAgICAgICArIGdyaWQuc3Vic3RyKGluZGV4ICsgMSlcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzcGFjZSBpcyBlaXRoZXIgYWxyZWFkeSBtYXJrZWQgb3IgaXMgbm90IHZhbGlkLicpXG4gICAgfVxufVxuXG5UaWNUYWNUb2UucHJvdG90eXBlLmxvZ0dyaWRUb0NvbnNvbGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZFxuICAgIGlmIChncmlkKSB7XG4gICAgICAgIGdyaWQgPSBncmlkLnJlcGxhY2UoL2YvZywgJyAnKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgQXJyYXkuZnJvbSh7bGVuZ3RoOiAzfSwgKHYsIGspID0+IGsgKiAzKVxuICAgICAgICAgICAgLm1hcChpID0+IEFycmF5LmZyb20oZ3JpZC5zdWJzdHIoaSwgMykpLmpvaW4oJ3wnKSlcbiAgICAgICAgICAgIC5qb2luKCdcXG4tLS0tLVxcbicpXG4gICAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBncmlkIGlzIG5vdCBpbml0aWFsaXplZC4nKVxuICAgIH1cbn1cblxuVGljVGFjVG9lLnByb3RvdHlwZS5kZXRlY3RXaW4gPSBmdW5jdGlvbihtYXJrKSB7XG4gICAgcmV0dXJuIEQuZGV0ZWN0V2luKG1hcmssIHRoaXMuZ3JpZClcbn1cblxuLy8qIEZvciB0ZXN0aW5nIHB1cnBvc2VzLlxuVGljVGFjVG9lLnByb3RvdHlwZS5EID0gRFxuLy8qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpY1RhY1RvZSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEZSRUVfU1BBQ0U6ICdmJyxcbiAgICBYOiAneCcsXG4gICAgTzogJ28nLFxuICAgIFJPV1M6IFtcbiAgICAgICAgWzAsIDEsIDJdLFxuICAgICAgICBbMywgNCwgNV0sXG4gICAgICAgIFs2LCA3LCA4XSxcbiAgICAgICAgWzAsIDMsIDZdLFxuICAgICAgICBbMSwgNCwgN10sXG4gICAgICAgIFsyLCA1LCA4XSxcbiAgICAgICAgWzAsIDQsIDhdLFxuICAgICAgICBbMiwgNCwgNl1cbiAgICBdLFxuICAgIENPUk5FUlM6IFswLCAyLCA2LCA4XSxcbiAgICBFREdFUzogWzEsIDMsIDUsIDddLFxuICAgIENFTlRFUjogNCxcbiAgICBPUFBPU0lURV9DT1JORVI6IHtcbiAgICAgICAgMDogOCxcbiAgICAgICAgMjogNixcbiAgICAgICAgNjogMixcbiAgICAgICAgODogMFxuICAgIH1cbn0iLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxuXG5mdW5jdGlvbiBhc3NlcnRHcmlkRXhpc3RzKGdyaWQpIHtcbiAgICBpZiAodHlwZW9mIGdyaWQgPT09ICd1bmRlZmluZWQnIHx8IGdyaWQgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignR3JpZCBpcyBub3QgaW5pdGlhbGl6ZWQuJykgXG59XG5cbmZ1bmN0aW9uIG1hcmtlZChtYXJrLCBncmlkLCBpbmRleCkge1xuICAgIHJldHVybiBtYXJrID09PSBncmlkW2luZGV4XVxufVxuXG5mdW5jdGlvbiB0d29Db25zZWN1dGl2ZShwcmVkaWNhdGUsIGFycmF5KSB7XG4gICAgdmFyIGxhc3QgPSBmYWxzZVxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gYXJyYXkubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldXG4gICAgICAgIHZhciBjdXJyZW50ID0gcHJlZGljYXRlKHZhbHVlKVxuICAgICAgICBpZiAobGFzdCAmJiBjdXJyZW50KVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGFzdCA9IGN1cnJlbnRcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRldGVjdFdpbihtYXJrLCBncmlkKSB7XG4gICAgYXNzZXJ0R3JpZEV4aXN0cyhncmlkKVxuICAgIHZhciBST1dTID0gY29uc3RhbnRzLlJPV1NcbiAgICB2YXIgc3BhY2VJc01pbmUgPSBtYXJrZWQuYmluZChudWxsLCBtYXJrLCBncmlkKVxuICAgIHJldHVybiBST1dTLnNvbWUoZnVuY3Rpb24ocm93KSB7XG4gICAgICAgIHJldHVybiByb3cuZXZlcnkoc3BhY2VJc01pbmUpXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gZGV0ZWN0VHdvSW5BUm93KG1hcmssIGdyaWQpIHtcbiAgICBhc3NlcnRHcmlkRXhpc3RzKGdyaWQpXG4gICAgdmFyIFJPV1MgPSBjb25zdGFudHMuUk9XU1xuICAgIHZhciBzcGFjZUlzTWluZSA9IG1hcmtlZC5iaW5kKG51bGwsIG1hcmssIGdyaWQpXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBST1dTLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICB2YXIgcm93ID0gUk9XU1tpXVxuICAgICAgICBpZiAodHdvQ29uc2VjdXRpdmUoc3BhY2VJc01pbmUsIHJvdykpXG4gICAgICAgICAgICByZXR1cm4gcm93XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZXRlY3RGcmVlU3BhY2VzKGdyaWQpIHtcbiAgICBhc3NlcnRHcmlkRXhpc3RzKGdyaWQpXG4gICAgdmFyIEZSRUVfU1BBQ0UgPSBjb25zdGFudHMuRlJFRV9TUEFDRVxuICAgIHJldHVybiBBcnJheS5mcm9tKGdyaWQpLnJlZHVjZShmdW5jdGlvbihmcmVlU3BhY2VzLCBzcGFjZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKHNwYWNlID09PSBGUkVFX1NQQUNFKVxuICAgICAgICAgICAgZnJlZVNwYWNlcy5wdXNoKGluZGV4KVxuICAgICAgICByZXR1cm4gZnJlZVNwYWNlc1xuICAgIH0sIFtdKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBkZXRlY3RXaW46IGRldGVjdFdpbixcbiAgICBkZXRlY3RUd29JbkFSb3c6IGRldGVjdFR3b0luQVJvdyxcbiAgICBkZXRlY3RGcmVlU3BhY2VzOiBkZXRlY3RGcmVlU3BhY2VzXG59IiwidmFyIFRpY1RhY1RvZSA9IHJlcXVpcmUoJy4vbGliL1RpY1RhY1RvZScpXG52YXIgQUkgPSByZXF1aXJlKCcuL2xpYi9BSScpXG5cbnZhciB0dHQgPSBuZXcgVGljVGFjVG9lKG5ldyBBSSgpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHR0dCJdfQ==
