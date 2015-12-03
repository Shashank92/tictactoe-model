var expect = require('chai').expect
var D = require('../src/lib/detect')
Object.assign(global, require('../src/lib/constants'))

function testDetect() {
    // ***freeSpaces***
    expect(D('fffffffff').freeSpaces()).deep.equal([0,1,2,3,4,5,6,7,8])
    expect(D('oofofofoo').freeSpaces()).deep.equal([2, 4, 6])
    expect(D('fxxxfxxxf').freeSpaces()).deep.equal([0, 4, 8])

    // ***isEmpty***
    expect(D('fffffffff').isEmpty()).equal(true)
    expect(D('ffffxffff').isEmpty()).equal(false)
    expect(D('ffffoffff').isEmpty()).equal(false)

    // ***winningRow***

    // Empty
    expect(D('fffffffff').winningRow(X)).is.undefined
    expect(D('fffffffff').winningRow(O)).is.undefined

    // Straight Line
    expect(D('xxxofooof').winningRow(X)).deep.equal([0, 1, 2])
    expect(D('xxxooofff').winningRow(O)).deep.equal([3, 4, 5])

    // Diags
    expect(D('xoooxooox').winningRow(X)).deep.equal([0, 4, 8])
    expect(D('ooxoxoxoo').winningRow(X)).deep.equal([2, 4, 6])

    expect(D('oxxxoxxxo').winningRow(O)).deep.equal([0, 4, 8])
    expect(D('xxoxoxoxx').winningRow(O)).deep.equal([2, 4, 6])

    // ***waysToWin***
    expect(D('xfffffffx').waysToWin(X)).deep.equal([4])
    expect(D('ffofffoff').waysToWin(O)).deep.equal([4])
    expect(D('xfofffxfo').waysToWin(X)).deep.equal([3])
    expect(D('xfofffxfo').waysToWin(O)).deep.equal([5])
    expect(D('xfxfffxfx').waysToWin(X)).deep.equal([1, 3, 4, 5, 7])

    // ***children***
    expect(D('xxxxxxxfx').children(X)).deep.equal(['xxxxxxxxx'])

    console.log('Detect - all tests passed.')
}

if (require.main === module) {
    testDetect()
} else {
    module.exports = {
        testDetect: testDetect
    }
}