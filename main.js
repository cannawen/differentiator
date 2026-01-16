const assert = require('assert');

derivative("2x")

// assume variable is always named x
function derivative(equation) {
    const matches = equation.matchAll(/(\d+)x/g);
    console.log(matches)
    matches.forEach((e) => {
        console.log(e)
    })
}

// pass in any command line arg to enable tests
if (process.argv[2]) {
    assert.strictEqual(0,derivative("2"));
    assert.strictEqual(2,derivative("2x"));
}

