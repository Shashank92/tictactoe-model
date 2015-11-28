import TicTacToe from './lib/TicTacToe'
import AI from './lib/AI'

const ttt = new TicTacToe(new AI())
if (global)
  global.ttt = ttt
else if (window)
  window.ttt = ttt