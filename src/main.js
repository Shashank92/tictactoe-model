import TicTacToe from './lib/TicTacToe'
import AI from './lib/AI'

let ttt = new TicTacToe(new AI());

(   typeof global ===  'object' ? global :
    typeof window === 'object' ? window :
    typeof self === 'object' ? self :
    typeof this === 'object' ? this : {}
).ttt = ttt

export default ttt