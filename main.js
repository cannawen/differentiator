const assert = require('assert');

console.log(derivativeToString(derivative("2")))
console.log(derivativeToString(derivative("2x")))

// assume variable is always named x
function derivative(equation) {
    const matches = [... equation.matchAll(/(\d+)x/g)];
    return matches.map((match) => {
        return match[1];
    })
}

function derivativeToString(derivatives) {
    return derivatives.reduce((memo, derivative) => {
        return memo += derivative;
    }, "")
}

// pass in any command line arg to enable tests
if (process.argv[2]) {
    assert.strictEqual("0",derivative("2"));
    assert.strictEqual("2",derivative("2x"));
}

