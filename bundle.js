(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('./constants');

var _detectWinner = require('./detectWinner');

var _detectWinner2 = _interopRequireDefault(_detectWinner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AI = (function () {
    function AI() {
        _classCallCheck(this, AI);
    }

    _createClass(AI, [{
        key: 'markRandom',
        value: function markRandom(mark, grid) {
            var freeSpaces = this.findFreeSpaces(grid);
            var randomChoice = Math.floor(Math.random() * freeSpaces.length);
            this.markSpace(mark, grid, freeSpaces[randomChoice]);
        }
    }, {
        key: 'markBest',
        value: function markBest(mark, grid) {}
    }, {
        key: 'findFreeSpaces',
        value: function findFreeSpaces(grid) {
            return grid.reduce(function (freeSpaces, space, index) {
                if (space === _constants.FREE_SPACE) freeSpaces.push(index);
                return freeSpaces;
            }, []);
        }
    }, {
        key: 'markSpace',
        value: function markSpace(mark, grid, index) {
            if (grid[index] === _constants.FREE_SPACE) grid[index] = mark;else throw new Error('The AI is attempting to mark an occupied space.');
        }
    }]);

    return AI;
})();

exports.default = AI;

},{"./constants":3,"./detectWinner":4}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('./constants');

var _detectWinner2 = require('./detectWinner');

var _detectWinner3 = _interopRequireDefault(_detectWinner2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TicTacToe = (function () {
    function TicTacToe(ai) {
        _classCallCheck(this, TicTacToe);

        this.ai = ai;
    }

    _createClass(TicTacToe, [{
        key: 'startNewGame',
        value: function startNewGame(difficulty, playerMark) {
            this.aiChooseAndMark = (!difficulty || difficulty === 'easy' ? this.ai.markRandom : this.ai.markBest).bind(this.ai);
            this.playerMark = playerMark || _constants.X;
            this.aiMark = this.playerMark === _constants.X ? _constants.O : _constants.X;
            this.grid = new Array(9).fill(_constants.FREE_SPACE);
            if (this.aiMark === _constants.X) this.yieldToAI();
        }
    }, {
        key: 'yieldToAI',
        value: function yieldToAI() {
            this.aiChooseAndMark(this.aiMark, this.grid);
        }
    }, {
        key: 'markSpace',
        value: function markSpace(index) {
            if (this.grid[index] === _constants.FREE_SPACE) this.grid[index] = this.playerMark;else throw new Error('The space is already marked.');
        }
    }, {
        key: 'logGridToConsole',
        value: function logGridToConsole() {
            var _this = this;

            if (this.grid) {
                console.log(Array.from({ length: 3 }, function (v, k) {
                    return k * 3;
                }).map(function (i) {
                    return _this.grid.slice(i, i + 3).join('|');
                }).join('\n-----\n'));
            } else {
                throw new Error('The grid is not initialized.');
            }
        }
    }, {
        key: 'detectWinner',
        value: function detectWinner() {
            return (0, _detectWinner3.default)(this.grid);
        }
    }]);

    return TicTacToe;
})();

exports.default = TicTacToe;

},{"./constants":3,"./detectWinner":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var FREE_SPACE = exports.FREE_SPACE = ' ';
var X = exports.X = 'X';
var O = exports.O = 'O';
var ROWS = exports.ROWS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = detectWinner;

var _constants = require('./constants');

function detectWinner(grid) {
    var winner = undefined;
    var markedByX = function markedByX(index) {
        return grid[index] === _constants.X;
    };
    var markedByO = function markedByO(index) {
        return grid[index] === _constants.O;
    };
    _constants.ROWS.some(function (row) {
        if (row.every(markedByX)) winner = _constants.X;else if (row.every(markedByO)) winner = _constants.O;
        return winner;
    });
    return winner;
}

},{"./constants":3}],5:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _TicTacToe = require('./lib/TicTacToe');

var _TicTacToe2 = _interopRequireDefault(_TicTacToe);

var _AI = require('./lib/AI');

var _AI2 = _interopRequireDefault(_AI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var ttt = new _TicTacToe2.default(new _AI2.default());

((typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' ? global : (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' ? self : _typeof(undefined) === 'object' ? undefined : {}).ttt = ttt;

exports.default = ttt;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./lib/AI":1,"./lib/TicTacToe":2}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9saWIvQUkuanMiLCJzcmMvbGliL1RpY1RhY1RvZS5qcyIsInNyYy9saWIvY29uc3RhbnRzLmpzIiwic3JjL2xpYi9kZXRlY3RXaW5uZXIuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0dxQixFQUFFO2FBQUYsRUFBRTs4QkFBRixFQUFFOzs7aUJBQUYsRUFBRTs7bUNBRVIsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNuQixnQkFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMxQyxnQkFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hFLGdCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7U0FDdkQ7OztpQ0FFUSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBRXBCOzs7dUNBRWMsSUFBSSxFQUFFO0FBQ2pCLG1CQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBSztBQUM3QyxvQkFBSSxLQUFLLGdCQWpCYixVQUFVLEFBaUJrQixFQUN4QixVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3RCLHVCQUFPLFVBQVUsQ0FBQTthQUNwQixFQUFFLEVBQUUsQ0FBQyxDQUFBO1NBQ1Q7OztrQ0FFUyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN6QixnQkFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQXhCZixVQUFVLEFB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QUosSUFBSSxPQUFLLFFBQVEsR0FBRyxJQUFJLEdBQy9CLHVCQUFnQixRQUFRLGVBQVUsRUFBRSxDQUFBLENBQ3RDLEdBQUcsR0FBRyxHQUFHLENBQUE7O2tCQUVJLEdBQUciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtGUkVFX1NQQUNFLCBYLCBPfSBmcm9tICcuL2NvbnN0YW50cydcbmltcG9ydCBkZXRlY3RXaW5uZXIgZnJvbSAnLi9kZXRlY3RXaW5uZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFJIHtcblxuICAgIG1hcmtSYW5kb20obWFyaywgZ3JpZCkge1xuICAgICAgICBsZXQgZnJlZVNwYWNlcyA9IHRoaXMuZmluZEZyZWVTcGFjZXMoZ3JpZClcbiAgICAgICAgbGV0IHJhbmRvbUNob2ljZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGZyZWVTcGFjZXMubGVuZ3RoKVxuICAgICAgICB0aGlzLm1hcmtTcGFjZShtYXJrLCBncmlkLCBmcmVlU3BhY2VzW3JhbmRvbUNob2ljZV0pXG4gICAgfVxuXG4gICAgbWFya0Jlc3QobWFyaywgZ3JpZCkge1xuXG4gICAgfVxuXG4gICAgZmluZEZyZWVTcGFjZXMoZ3JpZCkge1xuICAgICAgICByZXR1cm4gZ3JpZC5yZWR1Y2UoKGZyZWVTcGFjZXMsIHNwYWNlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKHNwYWNlID09PSBGUkVFX1NQQUNFKVxuICAgICAgICAgICAgZnJlZVNwYWNlcy5wdXNoKGluZGV4KVxuICAgICAgICAgICAgcmV0dXJuIGZyZWVTcGFjZXNcbiAgICAgICAgfSwgW10pXG4gICAgfVxuXG4gICAgbWFya1NwYWNlKG1hcmssIGdyaWQsIGluZGV4KSB7XG4gICAgICAgIGlmIChncmlkW2luZGV4XSA9PT0gRlJFRV9TUEFDRSlcbiAgICAgICAgICAgIGdyaWRbaW5kZXhdID0gbWFya1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBBSSBpcyBhdHRlbXB0aW5nIHRvIG1hcmsgYW4gb2NjdXBpZWQgc3BhY2UuJylcbiAgICB9XG5cbn0iLCJpbXBvcnQge0ZSRUVfU1BBQ0UsIFgsIE99IGZyb20gJy4vY29uc3RhbnRzJ1xuaW1wb3J0IGRldGVjdFdpbm5lciBmcm9tICcuL2RldGVjdFdpbm5lcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGljVGFjVG9lIHtcblxuICAgIGNvbnN0cnVjdG9yKGFpKSB7XG4gICAgICAgIHRoaXMuYWkgPSBhaVxuICAgIH1cblxuICAgIHN0YXJ0TmV3R2FtZShkaWZmaWN1bHR5LCBwbGF5ZXJNYXJrKSB7XG4gICAgICAgIHRoaXMuYWlDaG9vc2VBbmRNYXJrID0gKCFkaWZmaWN1bHR5IHx8IGRpZmZpY3VsdHkgPT09ICdlYXN5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmFpLm1hcmtSYW5kb21cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy5haS5tYXJrQmVzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLmJpbmQodGhpcy5haSlcbiAgICAgICAgdGhpcy5wbGF5ZXJNYXJrID0gcGxheWVyTWFyayB8fCBYXG4gICAgICAgIHRoaXMuYWlNYXJrID0gdGhpcy5wbGF5ZXJNYXJrID09PSBYID8gTyA6IFhcbiAgICAgICAgdGhpcy5ncmlkID0gbmV3IEFycmF5KDkpLmZpbGwoRlJFRV9TUEFDRSlcbiAgICAgICAgaWYgKHRoaXMuYWlNYXJrID09PSBYKVxuICAgICAgICAgICAgdGhpcy55aWVsZFRvQUkoKVxuICAgIH1cblxuICAgIHlpZWxkVG9BSSgpIHtcbiAgICAgICAgdGhpcy5haUNob29zZUFuZE1hcmsodGhpcy5haU1hcmssIHRoaXMuZ3JpZClcbiAgICB9XG5cbiAgICBtYXJrU3BhY2UoaW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZFtpbmRleF0gPT09IEZSRUVfU1BBQ0UpXG4gICAgICAgICAgICB0aGlzLmdyaWRbaW5kZXhdID0gdGhpcy5wbGF5ZXJNYXJrXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHNwYWNlIGlzIGFscmVhZHkgbWFya2VkLicpXG4gICAgfVxuXG4gICAgbG9nR3JpZFRvQ29uc29sZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coQXJyYXkuZnJvbSh7bGVuZ3RoOiAzfSwgKHYsIGspID0+IGsgKiAzKVxuICAgICAgICAgICAgICAgIC5tYXAoaSA9PiB0aGlzLmdyaWQuc2xpY2UoaSwgaSArIDMpLmpvaW4oJ3wnKSlcbiAgICAgICAgICAgICAgICAuam9pbignXFxuLS0tLS1cXG4nKVxuICAgICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZ3JpZCBpcyBub3QgaW5pdGlhbGl6ZWQuJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRldGVjdFdpbm5lcigpIHtcbiAgICAgICAgcmV0dXJuIGRldGVjdFdpbm5lcih0aGlzLmdyaWQpXG4gICAgfVxuXG59IiwiZXhwb3J0IGNvbnN0IEZSRUVfU1BBQ0UgPSAnICdcbmV4cG9ydCBjb25zdCBYID0gJ1gnXG5leHBvcnQgY29uc3QgTyA9ICdPJ1xuZXhwb3J0IGNvbnN0IFJPV1MgPSBbXG4gICAgWzAsIDEsIDJdLFxuICAgIFszLCA0LCA1XSxcbiAgICBbNiwgNywgOF0sXG4gICAgWzAsIDMsIDZdLFxuICAgIFsxLCA0LCA3XSxcbiAgICBbMiwgNSwgOF0sXG4gICAgWzAsIDQsIDhdLFxuICAgIFsyLCA0LCA2XVxuXSIsImltcG9ydCB7WCwgTywgUk9XU30gZnJvbSAnLi9jb25zdGFudHMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRldGVjdFdpbm5lcihncmlkKSB7XG4gICAgbGV0IHdpbm5lclxuICAgIGxldCBtYXJrZWRCeVggPSBpbmRleCA9PiBncmlkW2luZGV4XSA9PT0gWFxuICAgIGxldCBtYXJrZWRCeU8gPSBpbmRleCA9PiBncmlkW2luZGV4XSA9PT0gT1xuICAgIFJPV1Muc29tZSgocm93KSA9PiB7XG4gICAgICAgIGlmIChyb3cuZXZlcnkobWFya2VkQnlYKSlcbiAgICAgICAgICAgIHdpbm5lciA9IFhcbiAgICAgICAgZWxzZSBpZiAocm93LmV2ZXJ5KG1hcmtlZEJ5TykpXG4gICAgICAgICAgICB3aW5uZXIgPSBPXG4gICAgICAgIHJldHVybiB3aW5uZXJcbiAgICB9KVxuICAgIHJldHVybiB3aW5uZXJcbn0iLCJpbXBvcnQgVGljVGFjVG9lIGZyb20gJy4vbGliL1RpY1RhY1RvZSdcbmltcG9ydCBBSSBmcm9tICcuL2xpYi9BSSdcblxubGV0IHR0dCA9IG5ldyBUaWNUYWNUb2UobmV3IEFJKCkpO1xuXG4oICAgdHlwZW9mIGdsb2JhbCA9PT0gICdvYmplY3QnID8gZ2xvYmFsIDpcbiAgICB0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6XG4gICAgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnID8gc2VsZiA6XG4gICAgdHlwZW9mIHRoaXMgPT09ICdvYmplY3QnID8gdGhpcyA6IHt9XG4pLnR0dCA9IHR0dFxuXG5leHBvcnQgZGVmYXVsdCB0dHQiXX0=
