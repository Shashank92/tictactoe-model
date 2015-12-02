(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
Object.assign(global, require('./src/lib/constants'))
global.D = require('./src/lib/detect')

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./src/lib/constants":2,"./src/lib/detect":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
(function (global){
var constants = require('./constants')

Object.assign(global, constants)

// General Utility
function exists(value) {
    return typeof value !== 'undefined' && value !== null
}

function assertGridExists(grid) {
    if (!exists(grid))
        throw new Error('Grid is either undefined or null.')
}

function unique(values) {
    return values.reduce(function(seen, value) {
        return ~seen.indexOf(value) ? seen : seen.concat(value)
    }, [])
}

function D(grid) {
    assertGridExists(grid)

    // Utility
    function isFreeSpace(index) {
        return grid[index] === FREE_SPACE
    }

   function markedBy(mark, index) {
        return grid[index] === mark
    }

    function twoMarkedBy(mark, row) {
        var spaceIsMine = markedBy.bind(null, mark)
        return row.filter(spaceIsMine).length === 2
    }

    // Interface
    function isEmpty() {
        return Array.from(grid).every(function(character, index) {
            return isFreeSpace(index)
        })
    }

    function freeSpaces() {
        return Array.from(grid).reduce(function(freeSpace, space, index) {
            return  space === FREE_SPACE
                    ? freeSpace.concat(index)
                    : freeSpace
        }, [])
    }

    function wins(mark) {
        var spaceIsMine = markedBy.bind(null, mark)
        return ROWS.some(function(row) {
            return row.every(spaceIsMine)
        })
    }

    function waysToWin(mark) {
        var twoSpacesAreMine = twoMarkedBy.bind(null, mark)
        return  unique(
                    ROWS.filter(twoSpacesAreMine)
                    .map(function(row) {
                        return row.find(isFreeSpace)
                    })
                    .filter(exists)
                ).sort()
    }

    return {
        isEmpty: isEmpty,
        freeSpaces: freeSpaces,
        wins: wins,
        waysToWin: waysToWin
    }
}

module.exports = D
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./constants":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC5qcyIsInNyYy9saWIvY29uc3RhbnRzLmpzIiwic3JjL2xpYi9kZXRlY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBOzs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiT2JqZWN0LmFzc2lnbihnbG9iYWwsIHJlcXVpcmUoJy4vc3JjL2xpYi9jb25zdGFudHMnKSlcbmdsb2JhbC5EID0gcmVxdWlyZSgnLi9zcmMvbGliL2RldGVjdCcpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBGUkVFX1NQQUNFOiAnZicsXG4gICAgWDogJ3gnLFxuICAgIE86ICdvJyxcbiAgICBST1dTOiBbXG4gICAgICAgIFswLCAxLCAyXSxcbiAgICAgICAgWzMsIDQsIDVdLFxuICAgICAgICBbNiwgNywgOF0sXG4gICAgICAgIFswLCAzLCA2XSxcbiAgICAgICAgWzEsIDQsIDddLFxuICAgICAgICBbMiwgNSwgOF0sXG4gICAgICAgIFswLCA0LCA4XSxcbiAgICAgICAgWzIsIDQsIDZdXG4gICAgXSxcbiAgICBDT1JORVJTOiBbMCwgMiwgNiwgOF0sXG4gICAgRURHRVM6IFsxLCAzLCA1LCA3XSxcbiAgICBDRU5URVI6IDQsXG4gICAgT1BQT1NJVEVfQ09STkVSOiB7XG4gICAgICAgIDA6IDgsXG4gICAgICAgIDI6IDYsXG4gICAgICAgIDY6IDIsXG4gICAgICAgIDg6IDBcbiAgICB9XG59IiwidmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJylcblxuT2JqZWN0LmFzc2lnbihnbG9iYWwsIGNvbnN0YW50cylcblxuLy8gR2VuZXJhbCBVdGlsaXR5XG5mdW5jdGlvbiBleGlzdHModmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSAhPT0gbnVsbFxufVxuXG5mdW5jdGlvbiBhc3NlcnRHcmlkRXhpc3RzKGdyaWQpIHtcbiAgICBpZiAoIWV4aXN0cyhncmlkKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHcmlkIGlzIGVpdGhlciB1bmRlZmluZWQgb3IgbnVsbC4nKVxufVxuXG5mdW5jdGlvbiB1bmlxdWUodmFsdWVzKSB7XG4gICAgcmV0dXJuIHZhbHVlcy5yZWR1Y2UoZnVuY3Rpb24oc2VlbiwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIH5zZWVuLmluZGV4T2YodmFsdWUpID8gc2VlbiA6IHNlZW4uY29uY2F0KHZhbHVlKVxuICAgIH0sIFtdKVxufVxuXG5mdW5jdGlvbiBEKGdyaWQpIHtcbiAgICBhc3NlcnRHcmlkRXhpc3RzKGdyaWQpXG5cbiAgICAvLyBVdGlsaXR5XG4gICAgZnVuY3Rpb24gaXNGcmVlU3BhY2UoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGdyaWRbaW5kZXhdID09PSBGUkVFX1NQQUNFXG4gICAgfVxuXG4gICBmdW5jdGlvbiBtYXJrZWRCeShtYXJrLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gZ3JpZFtpbmRleF0gPT09IG1hcmtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0d29NYXJrZWRCeShtYXJrLCByb3cpIHtcbiAgICAgICAgdmFyIHNwYWNlSXNNaW5lID0gbWFya2VkQnkuYmluZChudWxsLCBtYXJrKVxuICAgICAgICByZXR1cm4gcm93LmZpbHRlcihzcGFjZUlzTWluZSkubGVuZ3RoID09PSAyXG4gICAgfVxuXG4gICAgLy8gSW50ZXJmYWNlXG4gICAgZnVuY3Rpb24gaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZ3JpZCkuZXZlcnkoZnVuY3Rpb24oY2hhcmFjdGVyLCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzRnJlZVNwYWNlKGluZGV4KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyZWVTcGFjZXMoKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGdyaWQpLnJlZHVjZShmdW5jdGlvbihmcmVlU3BhY2UsIHNwYWNlLCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuICBzcGFjZSA9PT0gRlJFRV9TUEFDRVxuICAgICAgICAgICAgICAgICAgICA/IGZyZWVTcGFjZS5jb25jYXQoaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIDogZnJlZVNwYWNlXG4gICAgICAgIH0sIFtdKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdpbnMobWFyaykge1xuICAgICAgICB2YXIgc3BhY2VJc01pbmUgPSBtYXJrZWRCeS5iaW5kKG51bGwsIG1hcmspXG4gICAgICAgIHJldHVybiBST1dTLnNvbWUoZnVuY3Rpb24ocm93KSB7XG4gICAgICAgICAgICByZXR1cm4gcm93LmV2ZXJ5KHNwYWNlSXNNaW5lKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdheXNUb1dpbihtYXJrKSB7XG4gICAgICAgIHZhciB0d29TcGFjZXNBcmVNaW5lID0gdHdvTWFya2VkQnkuYmluZChudWxsLCBtYXJrKVxuICAgICAgICByZXR1cm4gIHVuaXF1ZShcbiAgICAgICAgICAgICAgICAgICAgUk9XUy5maWx0ZXIodHdvU3BhY2VzQXJlTWluZSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbihyb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb3cuZmluZChpc0ZyZWVTcGFjZSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihleGlzdHMpXG4gICAgICAgICAgICAgICAgKS5zb3J0KClcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpc0VtcHR5OiBpc0VtcHR5LFxuICAgICAgICBmcmVlU3BhY2VzOiBmcmVlU3BhY2VzLFxuICAgICAgICB3aW5zOiB3aW5zLFxuICAgICAgICB3YXlzVG9XaW46IHdheXNUb1dpblxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEIl19
