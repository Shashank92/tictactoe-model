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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9saWIvQUkuanMiLCJzcmMvbGliL1RpY1RhY1RvZS5qcyIsInNyYy9saWIvY29uc3RhbnRzLmpzIiwic3JjL2xpYi9kZXRlY3QuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpXG52YXIgRCA9IHJlcXVpcmUoJy4vZGV0ZWN0JylcblxuZnVuY3Rpb24gbWFya1NwYWNlKG1hcmssIGdyaWQsIGluZGV4KSB7XG4gICAgdmFyIEZSRUVfU1BBQ0UgPSBjb25zdGFudHMuRlJFRV9TUEFDRVxuICAgIGlmIChncmlkW2luZGV4XSA9PT0gRlJFRV9TUEFDRSkge1xuICAgICAgICByZXR1cm4gIGdyaWQuc3Vic3RyKDAsIGluZGV4KVxuICAgICAgICAgICAgICAgICsgbWFya1xuICAgICAgICAgICAgICAgICsgZ3JpZC5zdWJzdHIoaW5kZXggKyAxKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIEFJIGlzIGF0dGVtcHRpbmcgdG8gbWFyayBhIG1hcmtlZCBzcGFjZS4nKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gQUkoKSB7fVxuXG5BSS5wcm90b3R5cGUubWFya1JhbmRvbSA9IGZ1bmN0aW9uKG1hcmssIGdyaWQpIHtcbiAgICB2YXIgZnJlZVNwYWNlcyA9IEQuZGV0ZWN0RnJlZVNwYWNlcyhncmlkKVxuICAgIHZhciByYW5kb21DaG9pY2UgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBmcmVlU3BhY2VzLmxlbmd0aClcbiAgICByZXR1cm4gbWFya1NwYWNlKG1hcmssIGdyaWQsIGZyZWVTcGFjZXNbcmFuZG9tQ2hvaWNlXSlcbn1cblxuQUkucHJvdG90eXBlLm1hcmtCZXN0ID0gZnVuY3Rpb24obWFyaywgZ3JpZCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtSYW5kb20obWFyaywgZ3JpZClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBSSIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpXG52YXIgRCA9IHJlcXVpcmUoJy4vZGV0ZWN0JylcblxuZnVuY3Rpb24gVGljVGFjVG9lKGFpKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzICE9PSAnb2JqZWN0JyB8fCB0aGlzID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RpY1RhY1RvZSBpcyBhIGNvbnN0cnVjdG9yIGFuZCBtdXN0IGJlIGNhbGxlZCB3aXRoIG5ldycpXG4gICAgdGhpcy5haSA9IGFpXG59XG5cblRpY1RhY1RvZS5wcm90b3R5cGUuc3RhcnROZXdHYW1lID0gZnVuY3Rpb24ocGxheWVyTWFyaywgZGlmZmljdWx0eSkge1xuICAgIHZhciBGUkVFX1NQQUNFID0gY29uc3RhbnRzLkZSRUVfU1BBQ0VcbiAgICB2YXIgWCA9IGNvbnN0YW50cy5YXG4gICAgdmFyIE8gPSBjb25zdGFudHMuT1xuICAgIHRoaXMucGxheWVyTWFyayA9IHBsYXllck1hcmsgfHwgWFxuICAgIHRoaXMuYWlNYXJrID0gdGhpcy5wbGF5ZXJNYXJrID09PSBYID8gTyA6IFhcbiAgICB0aGlzLmdyaWQgPSBBcnJheSg5KS5maWxsKEZSRUVfU1BBQ0UpLmpvaW4oJycpXG4gICAgdGhpcy5haUFwcGx5U3RyYXRlZ3kgPSAoXG4gICAgICAgICFkaWZmaWN1bHR5IHx8IGRpZmZpY3VsdHkgPT09ICdlYXN5J1xuICAgICAgICA/IHRoaXMuYWkubWFya1JhbmRvbVxuICAgICAgICA6IHRoaXMuYWkubWFya0Jlc3RcbiAgICApLmJpbmQodGhpcy5haSlcbn1cblxuVGljVGFjVG9lLnByb3RvdHlwZS55aWVsZFRvQUkgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdyaWQgPSB0aGlzLmFpQXBwbHlTdHJhdGVneSh0aGlzLmFpTWFyaywgdGhpcy5ncmlkKVxufVxuXG5UaWNUYWNUb2UucHJvdG90eXBlLm1hcmtTcGFjZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgdmFyIEZSRUVfU1BBQ0UgPSBjb25zdGFudHMuRlJFRV9TUEFDRVxuICAgIHZhciBncmlkID0gdGhpcy5ncmlkXG4gICAgaWYgKGdyaWRbaW5kZXhdID09PSBGUkVFX1NQQUNFKSB7XG4gICAgICAgIHRoaXMuZ3JpZCA9IGdyaWQuc3Vic3RyKDAsIGluZGV4KVxuICAgICAgICAgICAgICAgICAgICArIHRoaXMucGxheWVyTWFyayBcbiAgICAgICAgICAgICAgICAgICAgKyBncmlkLnN1YnN0cihpbmRleCArIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3BhY2UgaXMgZWl0aGVyIGFscmVhZHkgbWFya2VkIG9yIGlzIG5vdCB2YWxpZC4nKVxuICAgIH1cbn1cblxuVGljVGFjVG9lLnByb3RvdHlwZS5sb2dHcmlkVG9Db25zb2xlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdyaWQgPSB0aGlzLmdyaWRcbiAgICBpZiAoZ3JpZCkge1xuICAgICAgICBncmlkID0gZ3JpZC5yZXBsYWNlKC9mL2csICcgJykudG9VcHBlckNhc2UoKVxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIEFycmF5LmZyb20oe2xlbmd0aDogM30sICh2LCBrKSA9PiBrICogMylcbiAgICAgICAgICAgIC5tYXAoaSA9PiBBcnJheS5mcm9tKGdyaWQuc3Vic3RyKGksIDMpKS5qb2luKCd8JykpXG4gICAgICAgICAgICAuam9pbignXFxuLS0tLS1cXG4nKVxuICAgICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZ3JpZCBpcyBub3QgaW5pdGlhbGl6ZWQuJylcbiAgICB9XG59XG5cblRpY1RhY1RvZS5wcm90b3R5cGUuZGV0ZWN0V2luID0gZnVuY3Rpb24obWFyaykge1xuICAgIHJldHVybiBELmRldGVjdFdpbihtYXJrLCB0aGlzLmdyaWQpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGljVGFjVG9lIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgRlJFRV9TUEFDRTogJ2YnLFxuICAgIFg6ICd4JyxcbiAgICBPOiAnbycsXG4gICAgUk9XUzogW1xuICAgICAgICBbMCwgMSwgMl0sXG4gICAgICAgIFszLCA0LCA1XSxcbiAgICAgICAgWzYsIDcsIDhdLFxuICAgICAgICBbMCwgMywgNl0sXG4gICAgICAgIFsxLCA0LCA3XSxcbiAgICAgICAgWzIsIDUsIDhdLFxuICAgICAgICBbMCwgNCwgOF0sXG4gICAgICAgIFsyLCA0LCA2XVxuICAgIF0sXG4gICAgU0lERVM6IFsxLCAzLCA1LCA3XSxcbiAgICBDT1JORVJTOiBbMCwgMiwgNiwgOF0sXG4gICAgQ0VOVEVSOiA0LFxuICAgIE9QUE9TSVRFX0NPUk5FUjoge1xuICAgICAgICAwOiA4LFxuICAgICAgICAyOiA2LFxuICAgICAgICA2OiAyLFxuICAgICAgICA4OiAwXG4gICAgfVxufSIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpXG5cbmZ1bmN0aW9uIGFzc2VydEdyaWRFeGlzdHMoZ3JpZCkge1xuICAgIGlmICh0eXBlb2YgZ3JpZCA9PT0gJ3VuZGVmaW5lZCcgfHwgZ3JpZCA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHcmlkIGlzIG5vdCBpbml0aWFsaXplZC4nKSBcbn1cblxuZnVuY3Rpb24gbWFya2VkKG1hcmssIGdyaWQsIGluZGV4KSB7XG4gICAgcmV0dXJuIG1hcmsgPT09IGdyaWRbaW5kZXhdXG59XG5cbmZ1bmN0aW9uIHR3b0NvbnNlY3V0aXZlKHByZWRpY2F0ZSwgYXJyYXkpIHtcbiAgICB2YXIgbGFzdCA9IGZhbHNlXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBhcnJheS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV1cbiAgICAgICAgdmFyIGN1cnJlbnQgPSBwcmVkaWNhdGUodmFsdWUpXG4gICAgICAgIGlmIChsYXN0ICYmIGN1cnJlbnQpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBsYXN0ID0gY3VycmVudFxuICAgIH1cbn1cblxuZnVuY3Rpb24gZGV0ZWN0V2luKG1hcmssIGdyaWQpIHtcbiAgICBhc3NlcnRHcmlkRXhpc3RzKGdyaWQpXG4gICAgdmFyIFJPV1MgPSBjb25zdGFudHMuUk9XU1xuICAgIHZhciBzcGFjZUlzTWluZSA9IG1hcmtlZC5iaW5kKG51bGwsIG1hcmssIGdyaWQpXG4gICAgcmV0dXJuIFJPV1Muc29tZShmdW5jdGlvbihyb3cpIHtcbiAgICAgICAgcmV0dXJuIHJvdy5ldmVyeShzcGFjZUlzTWluZSlcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBkZXRlY3RUd29JbkFSb3cobWFyaywgZ3JpZCkge1xuICAgIGFzc2VydEdyaWRFeGlzdHMoZ3JpZClcbiAgICB2YXIgUk9XUyA9IGNvbnN0YW50cy5ST1dTXG4gICAgdmFyIHNwYWNlSXNNaW5lID0gbWFya2VkLmJpbmQobnVsbCwgbWFyaywgZ3JpZClcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IFJPV1MubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHZhciByb3cgPSBST1dTW2ldXG4gICAgICAgIGlmICh0d29Db25zZWN1dGl2ZShzcGFjZUlzTWluZSwgcm93KSlcbiAgICAgICAgICAgIHJldHVybiByb3dcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRldGVjdEZyZWVTcGFjZXMoZ3JpZCkge1xuICAgIGFzc2VydEdyaWRFeGlzdHMoZ3JpZClcbiAgICB2YXIgRlJFRV9TUEFDRSA9IGNvbnN0YW50cy5GUkVFX1NQQUNFXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZ3JpZCkucmVkdWNlKGZ1bmN0aW9uKGZyZWVTcGFjZXMsIHNwYWNlLCBpbmRleCkge1xuICAgICAgICBpZiAoc3BhY2UgPT09IEZSRUVfU1BBQ0UpXG4gICAgICAgICAgICBmcmVlU3BhY2VzLnB1c2goaW5kZXgpXG4gICAgICAgIHJldHVybiBmcmVlU3BhY2VzXG4gICAgfSwgW10pXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRldGVjdFdpbjogZGV0ZWN0V2luLFxuICAgIGRldGVjdFR3b0luQVJvdzogZGV0ZWN0VHdvSW5BUm93LFxuICAgIGRldGVjdEZyZWVTcGFjZXM6IGRldGVjdEZyZWVTcGFjZXNcbn0iLCJ2YXIgVGljVGFjVG9lID0gcmVxdWlyZSgnLi9saWIvVGljVGFjVG9lJylcbnZhciBBSSA9IHJlcXVpcmUoJy4vbGliL0FJJylcblxudmFyIHR0dCA9IG5ldyBUaWNUYWNUb2UobmV3IEFJKCkpXG5cbi8vKiBGb3IgdGVzdGluZyBwdXJwb3Nlc1xuOyggIHR5cGVvZiBnbG9iYWwgPT09ICAnb2JqZWN0JyA/IGdsb2JhbCA6XG4gICAgdHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyB3aW5kb3cgOlxuICAgIHR5cGVvZiBzZWxmID09PSAnb2JqZWN0JyA/IHNlbGYgOlxuICAgIHR5cGVvZiB0aGlzID09PSAnb2JqZWN0JyA/IHRoaXMgOiB7fVxuKS50dHQgPSB0dHRcbi8vKi9cblxubW9kdWxlLmV4cG9ydHMgPSB0dHQiXX0=
