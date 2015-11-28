import TicTacToe from './lib/TicTacToe'
import AI from './lib/AI'

(   typeof global ===  'object' ? global :
    typeof window === 'object' ? window :
    typeof self === 'object' ? self :
    typeof this === 'object' ? this : {}
).ttt = new TicTacToe(new AI());