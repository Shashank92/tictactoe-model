var TicTacToe = require('./lib/TicTacToe')
var AI = require('./lib/AI')

var ttt = new TicTacToe(new AI())

//* For testing purposes
ttt.D = require('./lib/detect')
//*/

//* For browser dump
;(typeof window === 'object' && window !== null ? window : {}).ttt = ttt
//*/

module.exports = ttt