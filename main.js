const assert = require("assert");

// pass in command line arg to enable tests
const TESTING = process.argv[2];

function toDerivativeString(terms) {
    return terms[1] || "0"
}

if (TESTING) {
    assert.deepEqual(parse("1"), {0: 1})
    assert.deepEqual(parse("1+1"), {0: 2})
    assert.deepEqual(parse("1+1-5"), {0: -3})
    assert.deepEqual(parse("1+2x^1"), {0: 1, 1: 2})
    assert.deepEqual(parse("1+2x^1+3x^2"), {0: 1, 1: 2, 2:3})
    assert.deepEqual(parse("-100x^34"), {34: -100})
    assert.deepEqual(parse("2x^6-100x^34"), {6: 2, 34: -100})
}

function parse(equation) {
    const matches = [... equation.matchAll(/(-?\d+)(x\^(\d+))?/g)];
    return matches.map((match) => {
        return { coefficient: parseInt(match[1]), power: match[3] || 0 }
    }).reduce((memo, {coefficient, power}) => {
        if (memo[power] === undefined) {
            memo[power] = 0;
        }
        memo[power] += coefficient;
        return memo;
    } , {})
}

if (TESTING) {
    assert.deepEqual(preprocess("5"), "5")
    assert.deepEqual(preprocess("- 5"), "-5")
    assert.deepEqual(preprocess("x"), "1x^1")
    assert.deepEqual(preprocess("-x"), "-1x^1")
    assert.deepEqual(preprocess("1+x"), "1+1x^1")
    assert.deepEqual(preprocess("1-x-1"), "1-1x^1-1")
}

function preprocess(equation) {
    return equation.replaceAll(/\s/g,"").replaceAll(/-x/g,"-1x").replaceAll(/(?<!\d)x/g, "1x").replaceAll(/x/g, "x^1")
}

// assume variable is always named x
function differentiate(equation) {
    return toDerivativeString(parse(preprocess(equation)));
}

if (TESTING) {
    assert.deepEqual("0",differentiate("2"));
    assert.deepEqual("0",differentiate("2+5"));
    assert.deepEqual("2",differentiate("2x"));
    assert.deepEqual("2",differentiate("2x+5"));
    assert.deepEqual("4",differentiate("2x+2x"));
    assert.deepEqual("1",differentiate("x"));
    assert.deepEqual("-1",differentiate("-x"));
    assert.deepEqual("-2",differentiate("-2x"));
    assert.deepEqual("-3",differentiate("-5x+2x+8-9"));
    // assert.deepEqual("2x",differentiate("x^2"));
}
