var expect = require('chai').expect
var D = require('../src/lib/detect')
Object.assign(global, require('../src/lib/constants'))

function testDetect() {
    // ***freeSpaces***
    expect(D.freeSpaces('fffffffff')).deep.equal([0,1,2,3,4,5,6,7,8])
    expect(D.freeSpaces('oofofofoo')).deep.equal([2, 4, 6])
    expect(D.freeSpaces('fxxxfxxxf')).deep.equal([0, 4, 8])

    
    // ***isEmpty***
    expect(D.isEmpty('fffffffff')).equal(true)
    expect(D.isEmpty('ffffxffff')).equal(false)
    expect(D.isEmpty('ffffoffff')).equal(false)

    // ***winningRow***

    // Empty
    expect(D.winningRow(X, 'fffffffff')).is.undefined
    expect(D.winningRow(O, 'fffffffff')).is.undefined

    
    // Straight Line
    expect(D.winningRow(X, 'xxxofooof')).deep.equal([0, 1, 2])
    expect(D.winningRow(O, 'xxxooofff')).deep.equal([3, 4, 5])

    
    // Diags
    expect(D.winningRow(X, 'xoooxooox')).deep.equal([0, 4, 8])
    
    expect(D.winningRow(X, 'ooxoxoxoo')).deep.equal([2, 4, 6])

    expect(D.winningRow(O, 'oxxxoxxxo')).deep.equal([0, 4, 8])
    expect(D.winningRow(O, 'xxoxoxoxx')).deep.equal([2, 4, 6])

    // ***waysToWin***
    expect(D.waysToWin(X, 'xfffffffx')).deep.equal([4])
    expect(D.waysToWin(O, 'ffofffoff')).deep.equal([4])
    expect(D.waysToWin(X, 'xfofffxfo')).deep.equal([3])
    expect(D.waysToWin(O, 'xfofffxfo')).deep.equal([5])
    expect(D.waysToWin(X, 'xfxfffxfx')).deep.equal([1, 3, 4, 5, 7])

    // ***children***
    var expected = [ { path: 7, grid: 'xxxxxxxxx' } ]
    expect(D.children(X, 'xxxxxxxfx')).deep.equal(expected)
    expected = [ 
        { path: 0, grid: 'oooooooof' },
        { path: 8, grid: 'foooooooo' } 
    ]
    expect(D.children(O, 'fooooooof')).deep.equal(expected)
    

    console.log('Detect - all tests passed.')
}

if (require.main === module) {
    testDetect()
} else {
    module.exports = {
        testDetect: testDetect
    }
}