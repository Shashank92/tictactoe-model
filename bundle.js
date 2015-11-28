(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AI = (function () {
  function AI() {
    _classCallCheck(this, AI);
  }

  _createClass(AI, [{
    key: 'markRandom',
    value: function markRandom(marker, grid) {
      var freeSpaces = this.findFreeSpaces(grid);
      var randomChoice = Math.floor(Math.random() * freeSpaces.length);
      grid[freeSpaces[randomChoice]] = marker;
    }
  }, {
    key: 'markBest',
    value: function markBest(marker, grid) {}
  }, {
    key: 'findFreeSpaces',
    value: function findFreeSpaces(grid) {
      return grid.reduce(function (freeSpaces, space, index) {
        if (space === _constants.FREE_SPACE) freeSpaces.push(index);
        return freeSpaces;
      }, []);
    }
  }]);

  return AI;
})();

exports.default = AI;

},{"./constants":3}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

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
    key: 'mark',
    value: function mark(index) {
      if (this.grid[index] === _constants.FREE_SPACE) this.grid[index] = this.playerMark;else throw new Error('Space is already marked!');
    }
  }, {
    key: 'detectWinner',
    value: function detectWinner() {
      var winner = undefined;
      var grid = this.grid;
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
  }, {
    key: 'logGridToConsole',
    value: function logGridToConsole() {
      if (this.grid) {
        console.log(this.grid.slice(0, 3).join('|'));
        console.log('-----');
        console.log(this.grid.slice(3, 6).join('|'));
        console.log('-----');
        console.log(this.grid.slice(6, 9).join('|'));
      } else {
        throw new Error('Grid is not initialized!');
      }
    }
  }]);

  return TicTacToe;
})();

exports.default = TicTacToe;

},{"./constants":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FREE_SPACE = exports.FREE_SPACE = ' ';
var X = exports.X = 'X';
var O = exports.O = 'O';
var ROWS = exports.ROWS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

},{}],4:[function(require,module,exports){
(function (global){
'use strict';

var _TicTacToe = require('./lib/TicTacToe');

var _TicTacToe2 = _interopRequireDefault(_TicTacToe);

var _AI = require('./lib/AI');

var _AI2 = _interopRequireDefault(_AI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ttt = new _TicTacToe2.default(new _AI2.default());
if (global) global.ttt = ttt;else if (window) window.ttt = ttt;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./lib/AI":1,"./lib/TicTacToe":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9saWIvQUkuanMiLCJzcmMvbGliL1RpY1RhY1RvZS5qcyIsInNyYy9saWIvY29uc3RhbnRzLmpzIiwic3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7SUNFcUIsRUFBRTtXQUFGLEVBQUU7MEJBQUYsRUFBRTs7O2VBQUYsRUFBRTs7K0JBRVYsTUFBTSxFQUFFLElBQUksRUFBRTtBQUN2QixVQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzFDLFVBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoRSxVQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFBO0tBQ3hDOzs7NkJBRVEsTUFBTSxFQUFFLElBQUksRUFBRSxFQUV0Qjs7O21DQUVjLElBQUksRUFBRTtBQUNuQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBSztBQUMvQyxZQUFJLEtBQUssZ0JBaEJQLFVBQVUsQUFnQlksRUFDdEIsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN4QixlQUFPLFVBQVUsQ0FBQTtPQUNsQixFQUFFLEVBQUUsQ0FBQyxDQUFBO0tBQ1A7OztTQWxCa0IsRUFBRTs7O2tCQUFGLEVBQUU7Ozs7Ozs7Ozs7Ozs7OztJQ0FGLFNBQVM7QUFFNUIsV0FGbUIsU0FBUyxDQUVoQixFQUFFLEVBQUU7MEJBRkcsU0FBUzs7QUFHMUIsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUE7R0FDYjs7ZUFKa0Is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QUFDLENBQUE7T0FDNUM7S0FDRjs7O1NBdERrQixTQUFTOzs7a0JBQVQsU0FBUzs7Ozs7Ozs7QUNGdkIsSUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHLEdBQUcsQ0FBQTtBQUN0QixJQUFNLENBQUMsV0FBRCxDQUFDLEdBQUcsR0FBRyxDQUFBO0FBQ2IsSUFBTSxDQUFDLFdBQUQsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtBQUNiLElBQU0sSUFBSSxXQUFKLElBQUksR0FBRyxDQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ1QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNULENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDVCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ1QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNULENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDVCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ1QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNWLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNURCxJQUFNLEdBQUcsR0FBRyx3QkFBYyxrQkFBUSxDQUFDLENBQUE7QUFDbkMsSUFBSSxNQUFNLEVBQ1IsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUEsS0FDYixJQUFJLE1BQU0sRUFDYixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge0ZSRUVfU1BBQ0UsIFgsIE99IGZyb20gJy4vY29uc3RhbnRzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBSSB7XG5cbiAgbWFya1JhbmRvbShtYXJrZXIsIGdyaWQpIHtcbiAgICBsZXQgZnJlZVNwYWNlcyA9IHRoaXMuZmluZEZyZWVTcGFjZXMoZ3JpZClcbiAgICBsZXQgcmFuZG9tQ2hvaWNlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZnJlZVNwYWNlcy5sZW5ndGgpXG4gICAgZ3JpZFtmcmVlU3BhY2VzW3JhbmRvbUNob2ljZV1dID0gbWFya2VyXG4gIH1cblxuICBtYXJrQmVzdChtYXJrZXIsIGdyaWQpIHtcblxuICB9XG5cbiAgZmluZEZyZWVTcGFjZXMoZ3JpZCkge1xuICAgIHJldHVybiBncmlkLnJlZHVjZSgoZnJlZVNwYWNlcywgc3BhY2UsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoc3BhY2UgPT09IEZSRUVfU1BBQ0UpXG4gICAgICAgIGZyZWVTcGFjZXMucHVzaChpbmRleClcbiAgICAgIHJldHVybiBmcmVlU3BhY2VzXG4gICAgfSwgW10pXG4gIH1cblxufSIsImltcG9ydCB7RlJFRV9TUEFDRSwgWCwgTywgUk9XU30gZnJvbSAnLi9jb25zdGFudHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpY1RhY1RvZSB7XG5cbiAgY29uc3RydWN0b3IoYWkpIHtcbiAgICB0aGlzLmFpID0gYWlcbiAgfVxuXG4gIHN0YXJ0TmV3R2FtZShkaWZmaWN1bHR5LCBwbGF5ZXJNYXJrKSB7XG4gICAgdGhpcy5haUNob29zZUFuZE1hcmsgPSAoIWRpZmZpY3VsdHkgfHwgZGlmZmljdWx0eSA9PT0gJ2Vhc3knXG4gICAgICAgICAgICAgICAgPyB0aGlzLmFpLm1hcmtSYW5kb21cbiAgICAgICAgICAgICAgICA6IHRoaXMuYWkubWFya0Jlc3RcbiAgICAgICAgICAgICAgKS5iaW5kKHRoaXMuYWkpXG4gICAgdGhpcy5wbGF5ZXJNYXJrID0gcGxheWVyTWFyayB8fCBYXG4gICAgdGhpcy5haU1hcmsgPSB0aGlzLnBsYXllck1hcmsgPT09IFggPyBPIDogWFxuICAgIHRoaXMuZ3JpZCA9IG5ldyBBcnJheSg5KS5maWxsKEZSRUVfU1BBQ0UpXG4gICAgaWYgKHRoaXMuYWlNYXJrID09PSBYKVxuICAgICAgdGhpcy55aWVsZFRvQUkoKVxuICB9XG5cbiAgeWllbGRUb0FJKCkge1xuICAgIHRoaXMuYWlDaG9vc2VBbmRNYXJrKHRoaXMuYWlNYXJrLCB0aGlzLmdyaWQpXG4gIH1cblxuICBtYXJrKGluZGV4KSB7XG4gICAgaWYgKHRoaXMuZ3JpZFtpbmRleF0gPT09IEZSRUVfU1BBQ0UpXG4gICAgICB0aGlzLmdyaWRbaW5kZXhdID0gdGhpcy5wbGF5ZXJNYXJrXG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTcGFjZSBpcyBhbHJlYWR5IG1hcmtlZCEnKVxuICB9XG5cbiAgZGV0ZWN0V2lubmVyKCkge1xuICAgIGxldCB3aW5uZXJcbiAgICBsZXQgZ3JpZCA9IHRoaXMuZ3JpZFxuICAgIGxldCBtYXJrZWRCeVggPSBpbmRleCA9PiBncmlkW2luZGV4XSA9PT0gWFxuICAgIGxldCBtYXJrZWRCeU8gPSBpbmRleCA9PiBncmlkW2luZGV4XSA9PT0gT1xuICAgIFJPV1Muc29tZSgocm93KSA9PiB7XG4gICAgICBpZiAocm93LmV2ZXJ5KG1hcmtlZEJ5WCkpXG4gICAgICAgIHdpbm5lciA9IFhcbiAgICAgIGVsc2UgaWYgKHJvdy5ldmVyeShtYXJrZWRCeU8pKVxuICAgICAgICB3aW5uZXIgPSBPXG4gICAgICByZXR1cm4gd2lubmVyXG4gICAgfSlcbiAgICByZXR1cm4gd2lubmVyXG4gIH1cblxuICBsb2dHcmlkVG9Db25zb2xlKCkge1xuICAgIGlmICh0aGlzLmdyaWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuZ3JpZC5zbGljZSgwLCAzKS5qb2luKCd8JykpXG4gICAgICBjb25zb2xlLmxvZygnLS0tLS0nKVxuICAgICAgY29uc29sZS5sb2codGhpcy5ncmlkLnNsaWNlKDMsIDYpLmpvaW4oJ3wnKSlcbiAgICAgIGNvbnNvbGUubG9nKCctLS0tLScpXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmdyaWQuc2xpY2UoNiwgOSkuam9pbignfCcpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dyaWQgaXMgbm90IGluaXRpYWxpemVkIScpXG4gICAgfVxuICB9XG5cbn0iLCJleHBvcnQgY29uc3QgRlJFRV9TUEFDRSA9ICcgJ1xuZXhwb3J0IGNvbnN0IFggPSAnWCdcbmV4cG9ydCBjb25zdCBPID0gJ08nXG5leHBvcnQgY29uc3QgUk9XUyA9IFtcbiAgWzAsIDEsIDJdLFxuICBbMywgNCwgNV0sXG4gIFs2LCA3LCA4XSxcbiAgWzAsIDMsIDZdLFxuICBbMSwgNCwgN10sXG4gIFsyLCA1LCA4XSxcbiAgWzAsIDQsIDhdLFxuICBbMiwgNCwgNl1cbl0iLCJpbXBvcnQgVGljVGFjVG9lIGZyb20gJy4vbGliL1RpY1RhY1RvZSdcbmltcG9ydCBBSSBmcm9tICcuL2xpYi9BSSdcblxuY29uc3QgdHR0ID0gbmV3IFRpY1RhY1RvZShuZXcgQUkoKSlcbmlmIChnbG9iYWwpXG4gIGdsb2JhbC50dHQgPSB0dHRcbmVsc2UgaWYgKHdpbmRvdylcbiAgd2luZG93LnR0dCA9IHR0dCJdfQ==
