import {FREE_SPACE, X, O} from './constants'
import detectWin from './detect'

export default class TicTacToe {

    constructor(ai) {
        this.ai = ai
    }

    startNewGame(difficulty, playerMark) {
        this.aiChooseAndMark = (
            !difficulty || difficulty === 'easy'
            ? this.ai.markRandom
            : this.ai.markBest
        ).bind(this.ai)
        this.playerMark = playerMark || X
        this.aiMark = this.playerMark === X ? O : X
        this.grid = Array(9).fill(FREE_SPACE).join('')
        if (this.aiMark === X)
            this.yieldToAI()
    }

    yieldToAI() {
        this.grid = this.aiChooseAndMark(this.aiMark, this.grid)
    }

    markSpace(index) {
        let grid = this.grid
        if (grid[index] === FREE_SPACE) {
            this.grid = grid.substr(0, index)
                        + this.playerMark 
                        + grid.substr(index + 1)
        } else {
            throw new Error('The space is either already marked or is not valid.')
        }
    }

    logGridToConsole() {
        let grid = this.grid
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

    detectWin(mark) {
        return detectWin(mark, this.grid)
    }

}