const assert = require('assert');

calculateDerivative(symbolExtractor("1x+2+3x"))

function symbolExtractor(equation) {
    const terms = [... equation.matchAll(/(\d+x?))/g)];
    const operations = [... equation.matchAll(([+/-])/g)];
    return matches.reduce((match) => {
        const match[1];
    }, {coefficients: [], operators: []})
}

function calculateDerivative(symbols) {
    return symbols.map((symbol) => {
        const containsX = symbol.match(/x/,"");
        console.log(containsX);
        return symbol;
    })
}

function toDerivativeString(coefficients) {
    return coefficients.reduce((memo, coefficient) => {
        return memo += coefficient;
    }, "")
}

// assume variable is always named x
function differentiate(equation) {
    return toDerivativeString(calculateDerivative(symbolExtractor(equation)));
}

// pass in any command line arg to enable tests
if (process.argv[2]) {
    assert.strictEqual("0",differentiate("2"));
    assert.strictEqual("0",differentiate("2+5"));
    assert.strictEqual("2",differentiate("2x"));
    assert.strictEqual("2",differentiate("2x+5"));
    assert.strictEqual("2+2",differentiate("2x+2x"));
}

