const assert = require("assert");

// pass in command line arg to enable tests
const TESTING = process.argv[2];

function toDerivativeString(terms) {
    return terms[1] || "0"
}

if (TESTING) {
    assert.deepEqual(parse("1+2x+3x+6"), {0: 7, 1: 5})
    const testMemo = {}
    upsertTermIntoMemo("2",testMemo)
    assert.deepEqual(testMemo,{0:2});
    upsertTermIntoMemo("2x^1",testMemo)
    assert.deepEqual(testMemo,{0:2, 1:2});
}

// this feels so wrong in my bones, to change the object in-place
// instead of returning a memo... shudder
function upsertTermIntoMemo(term, memo) {
    const m = term.match(/(\d+)(x\^)?(\d+)?/);

    const coefficient = parseInt(m[1]);
    const order = m[3] || 0;

    if (memo[order] === undefined) {
        memo[order] = coefficient;
    } else {
        memo[order] += coefficient;
    }
} 

function parse(equation) {
    const matches = [... equation.matchAll(/(-?\d+x?)/g)];
    return matches.map((match) => {
        return match[1]; // gets an array of terms: [1,2x,3x,6]
    }).reduce((memo, match) => {   
        if (match.includes("x")) {
            if (memo[1] === undefined) {
                memo[1] = 0
            }
            memo[1] += parseInt(match.replace("x",""));
        } else {
            if (memo[0] === undefined) {
                memo[0] = 0
            }
            memo[0] += parseInt(match);
        }
        return memo;
    }, {})
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
