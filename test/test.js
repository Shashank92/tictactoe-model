var expect = require('chai').expect
var D = require('../src/lib/detect')
Object.assign(global, require('../src/lib/constants'))

function testDetect() {
    // ***isEmpty***
    expect(D('fffffffff').isEmpty()).equal(true)
    expect(D('ffffxffff').isEmpty()).equal(false)
    expect(D('ffffoffff').isEmpty()).equal(false)

    // ***freeSpaces***
    expect(D('fffffffff').freeSpaces()).deep.equal([0,1,2,3,4,5,6,7,8])
    expect(D('oofofofoo').freeSpaces()).deep.equal([2, 4, 6])
    expect(D('fxxxfxxxf').freeSpaces()).deep.equal([0, 4, 8])

    // ***wins***

    // Empty
    expect(D('fffffffff').wins(X)).an('undefined')
    expect(D('fffffffff').wins(O)).an('undefined')

    // Straight Line
    expect(D('xxxofooof').wins(X)).deep.equal([0, 1, 2])
    expect(D('xxxooofff').wins(O)).deep.equal([3, 4, 5])

    // Diags
    expect(D('xoooxooox').wins(X)).deep.equal([0, 4, 8])
    expect(D('ooxoxoxoo').wins(X)).deep.equal([2, 4, 6])

    expect(D('oxxxoxxxo').wins(O)).deep.equal([0, 4, 8])
    expect(D('xxoxoxoxx').wins(O)).deep.equal([2, 4, 6])

    // ***waysToWin***
    expect(D('xfffffffx').waysToWin(X)).deep.equal([4])
    expect(D('ffofffoff').waysToWin(O)).deep.equal([4])
    expect(D('xfofffxfo').waysToWin(X)).deep.equal([3])
    expect(D('xfofffxfo').waysToWin(O)).deep.equal([5])
    expect(D('xfxfffxfx').waysToWin(X)).deep.equal([1, 3, 4, 5, 7])

    console.log('Detect - all tests passed.')
}

if (require.main === module) {
    testDetect()
} else {
    module.exports = {
        testDetect: testDetect
    }
}