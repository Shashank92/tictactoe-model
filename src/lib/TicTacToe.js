import {FREE_SPACE, X, O} from './constants'
import detectWinner from './detectWinner'

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

    markSpace(index) {
        if (this.grid[index] === FREE_SPACE)
            this.grid[index] = this.playerMark
        else
            throw new Error('The space is already marked.')
    }

    logGridToConsole() {
        if (this.grid) {
            console.log(Array.from({length: 3}, (v, k) => k * 3)
                .map(i => this.grid.slice(i, i + 3).join('|'))
                .join('\n-----\n')
            )
        } else {
            throw new Error('The grid is not initialized.')
        }
    }

    detectWinner() {
        return detectWinner(this.grid)
    }

}