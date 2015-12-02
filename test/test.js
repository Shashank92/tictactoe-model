var expect = require('chai').expect
var D = require('../src/main').D

// ***detectWin***
var xWins = D.detectWin.bind(null, 'x')
var oWins = D.detectWin.bind(null, 'o')

// Dumbs
expect(xWins('fffffffff')).to.equal(false)
expect(oWins('fffffffff')).to.equal(false)

// Straight Line
expect(xWins('xxxxxxxxx')).to.equal(true)
expect(oWins('ooooooooo')).to.equal(true)

// Diags
expect(xWins('xoooxooox')).to.equal(true)
expect(xWins('ooxoxoxoo')).to.equal(true)

expect(oWins('oxxxoxxxo')).to.equal(true)
expect(oWins('xxoxoxoxx')).to.equal(true)

// Throws
expect(xWins).to.throw(Error)
expect(oWins).to.throw(Error)

console.log('All tests passed')