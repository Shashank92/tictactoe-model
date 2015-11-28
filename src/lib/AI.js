import {FREE_SPACE, X, O} from './constants'
import detectWinner from './detectWinner'

export default class AI {

    markRandom(mark, grid) {
        let freeSpaces = this.findFreeSpaces(grid)
        let randomChoice = Math.floor(Math.random() * freeSpaces.length)
        this.markSpace(mark, grid, freeSpaces[randomChoice])
    }

    markBest(mark, grid) {

    }

    findFreeSpaces(grid) {
        return grid.reduce((freeSpaces, space, index) => {
            if (space === FREE_SPACE)
                freeSpaces.push(index)
            return freeSpaces
        }, [])
    }

    markSpace(mark, grid, index) {
        if (grid[index] === FREE_SPACE)
            grid[index] = mark
        else
            throw new Error('The AI is attempting to mark an occupied space.')
    }

}