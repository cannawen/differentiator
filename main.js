const assert = require('assert');

// assume variable is always named x
function derivative(equation) {
    const matches = [... equation.matchAll(/(\d+)x/g)];
    return matches.map((match) => {
        return match[1];
    })
}

function derivativeToString(derivatives) {
    if (derivatives.length === 0) {
        return "0"
    }
    return derivatives.reduce((memo, derivative) => {
        return memo += derivative;
    }, "")
}

function differentiate(equation) {
    return derivativeToString(derivative(equation));
}

// pass in any command line arg to enable tests
if (process.argv[2]) {
    assert.strictEqual("0",differentiate("2"));
    assert.strictEqual("2",differentiate("2x"));
}

