const assert = require('assert');

function coefficientExtractor(equation) {
    const matches = [... equation.matchAll(/(\d+)x/g)];
    return matches.map((match) => {
        return match[1];
    })
}

function toDerivativeString(coefficients) {
    if (coefficients.length === 0) {
        return "0"
    }
    return coefficients.reduce((memo, coefficient) => {
        return memo += coefficient;
    }, "")
}

// assume variable is always named x
function differentiate(equation) {
    return toDerivativeString(coefficientExtractor(equation));
}

// pass in any command line arg to enable tests
if (process.argv[2]) {
    assert.strictEqual("0",differentiate("2"));
    assert.strictEqual("0",differentiate("2+5"));
    assert.strictEqual("2",differentiate("2x"));
    assert.strictEqual("2",differentiate("2x+5"));
    assert.strictEqual("2+2",differentiate("2x+2x"));
}

