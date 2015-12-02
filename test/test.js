var expect = require('chai').expect
var D = require('../src/ttt').D

// ***detectWin***
var dw = D.detectWin
var xw = dw.bind(null, 'x')
var ow = dw.bind(null, 'o')

// Empty
expect(xw('fffffffff')).equal(false)
expect(ow('fffffffff')).equal(false)

// Straight Line
expect(xw('xxxxxxxxx')).equal(true)
expect(ow('ooooooooo')).equal(true)

// Diags
expect(xw('xoooxooox')).equal(true)
expect(xw('ooxoxoxoo')).equal(true)

expect(ow('oxxxoxxxo')).equal(true)
expect(ow('xxoxoxoxx')).equal(true)

// Throws
expect(xw).throw(Error)
expect(ow).throw(Error)

// ***detectFreeSpaces***
var dfs = D.detectFreeSpaces
expect(dfs('fffffffff')).deep.equal([0,1,2,3,4,5,6,7,8])
expect(dfs('oofofofoo')).deep.equal([2, 4, 6])
expect(dfs('fxxxfxxxf')).deep.equal([0, 4, 8])

// ***detectEmpty***
var de = D.detectEmpty
expect(de('fffffffff')).equal(true)
expect(de('ffffxffff')).equal(false)

// ***detectWaysToWin***
var dwtw = D.detectWaysToWin
var dwtwx = dwtw.bind(null, 'x')
var dwtwo = dwtw.bind(null, 'o')
expect(dwtwx('xfffffffx')).deep.equal([4])
expect(dwtwo('ffofffoff')).deep.equal([4])
expect(dwtwx('xfofffxfo')).deep.equal([3])
expect(dwtwo('xfofffxfo')).deep.equal([5])
expect(dwtwx('xfxfffxfx')).deep.equal([1, 3, 4, 5, 7])

console.log('All tests passed')