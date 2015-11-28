import {FREE_SPACE, X, O} from './constants'

export default class AI {

  markRandom(marker, grid) {
    let freeSpaces = this.findFreeSpaces(grid)
    let randomChoice = Math.floor(Math.random() * freeSpaces.length)
    grid[freeSpaces[randomChoice]] = marker
  }

  markBest(marker, grid) {

  }

  findFreeSpaces(grid) {
    return grid.reduce((freeSpaces, space, index) => {
      if (space === FREE_SPACE)
        freeSpaces.push(index)
      return freeSpaces
    }, [])
  }

}