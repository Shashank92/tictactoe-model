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