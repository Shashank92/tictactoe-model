import {FREE_SPACE, X, O, ROWS} from './constants'

export default class TicTacToe {

  constructor(ai) {
    this.ai = ai
  }

  startNewGame(difficulty, playerMark) {
    this.aiChooseAndMark = (!difficulty || difficulty === 'easy'
                ? this.ai.markRandom
                : this.ai.markBest
              ).bind(this.ai)
    this.playerMark = playerMark || X
    this.aiMark = this.playerMark === X ? O : X
    this.grid = new Array(9).fill(FREE_SPACE)
    if (this.aiMark === X)
      this.yieldToAI()
  }

  yieldToAI() {
    this.aiChooseAndMark(this.aiMark, this.grid)
  }

  mark(index) {
    if (this.grid[index] === FREE_SPACE)
      this.grid[index] = this.playerMark
    else
      throw new Error('Space is already marked!')
  }

  detectWinner() {
    let winner
    let grid = this.grid
    let markedByX = index => grid[index] === X
    let markedByO = index => grid[index] === O
    ROWS.some((row) => {
      if (row.every(markedByX))
        winner = X
      else if (row.every(markedByO))
        winner = O
      return winner
    })
    return winner
  }

  logGridToConsole() {
    if (this.grid) {
      console.log(this.grid.slice(0, 3).join('|'))
      console.log('-----')
      console.log(this.grid.slice(3, 6).join('|'))
      console.log('-----')
      console.log(this.grid.slice(6, 9).join('|'))
    } else {
      throw new Error('Grid is not initialized!')
    }
  }

}