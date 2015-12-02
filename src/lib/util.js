function exists(value) {
    return typeof value !== 'undefined' && value !== null
}

function assertGridExists(grid) {
    if (!exists(grid))
        throw new Error('Grid is either undefined or null.')
}

function unique(values) {
    return values.reduce(function(seen, value) {
        return ~seen.indexOf(value) ? seen : seen.concat(value)
    }, [])
}

module.exports = {
    exists: exists,
    assertGridExists: assertGridExists,
    unique: unique
}