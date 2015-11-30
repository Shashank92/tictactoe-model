import {FREE_SPACE, X, O} from './constants'
import {detectFreeSpaces, detectWin, detectTwoInARow} from './detect'

function markSpace(mark, grid, index) {
    if (grid[index] === FREE_SPACE) {
        return  grid.substr(0, index)
                + mark
                + grid.substr(index + 1)
    } else {
        throw new Error('The AI is attempting to mark a marked space.')
    }
}

export default class AI {

    markRandom(mark, grid) {
        let freeSpaces = detectFreeSpaces(grid)
        let randomChoice = Math.floor(Math.random() * freeSpaces.length)
        return markSpace(mark, grid, freeSpaces[randomChoice])
    }

    markBest(mark, grid) {
        return this.markRandom(mark, grid)
    }

}