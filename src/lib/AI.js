import {FREE_SPACE, X, O} from './constants'
import detectWinner from './detectWinner'

export default class AI {

    markRandom(mark, grid) {
        let freeSpaces = this.findFreeSpaces(grid)
        let randomChoice = Math.floor(Math.random() * freeSpaces.length)
        return this.markSpace(mark, grid, freeSpaces[randomChoice])
    }

    markBest(mark, grid) {
        let opponentMark = mark === X ? O : X
        let freeSpaces = this.findFreeSpaces(grid)
        let children = freeSpaces.map((index) => {

        })
        return this.markRandom(mark, grid)
    }

    findFreeSpaces(grid) {
        return Array.from(grid).reduce((freeSpaces, space, index) => {
            if (space === FREE_SPACE)
                freeSpaces.push(index)
            return freeSpaces
        }, [])
    }

    markSpace(mark, grid, index) {
        if (grid[index] === FREE_SPACE) {
            return  grid.substr(0, index)
                    + mark
                    + grid.substr(index + 1)
        } else {
            throw new Error('The AI is attempting to mark a marked space.')
        }
    }

}