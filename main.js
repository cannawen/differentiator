const assert = require("assert");

// pass in command line arg to enable tests
const TESTING = process.argv[2];

if (TESTING) {
    assert.deepEqual(differentiateTerms({2: 1}), [[1, 2]])
}

function differentiateTerms(terms) {
    return Object.entries(terms)
        .map((term) => {
            const exponent = parseInt(term[0]);
            const coefficient = parseInt(term[1]); // TODO I think this is already an int? Double check later.
            if (exponent === 0) {
                return undefined;
            }
            return [exponent - 1, exponent * coefficient];
        })
        .filter(terms => terms !== undefined); 
    // TODO Kind of sus we are turning a map {exp:coef,...} into a 2D array [[exp coef],...] randomly halfway through our program
    // Perhaps create a new data structure?
}

if (TESTING) {
    assert.deepEqual(toDerivativeString([[1, 2]]), "+2x^1");
    assert.deepEqual(postProcess("+2x^1"), "2x");
}

function toDerivativeString(terms) {
    if (terms.length === 0) {
        return "0";
    }
    return terms
        // .sort((termA, termB) => termA[0] - termB[0])
        .reduce((memo, [exponent, coefficient]) => {
            memo += "+" + coefficient + "x^" + exponent;
            return memo;
        },"");
}

function postProcess(equation) {
    if (equation === "0") return equation;
    return equation
        .replace(/^\+/,"")
        .replace(/1x/g, "x")
        .replace(/x\^1/g, "x")
        .replace(/x\^0/g, "")
        .replace(/[+-]0(x\^\d+)?/g, "")
        .replace(/\+-/g, "-");
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
    assert.deepEqual(preprocess("x^2"), "1x^2")
}

function preprocess(equation) {
    return equation.replaceAll(/\s/g,"").replaceAll(/-x/g,"-1x").replaceAll(/(?<!\d)x/g, "1x").replaceAll(/x(?!\^)/g, "x^1")
}

// assume variable is always named x
function differentiate(equation) {
    return postProcess(toDerivativeString(differentiateTerms(parse(preprocess(equation)))));
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
    assert.deepEqual("2x",differentiate("x^2"));
    assert.deepEqual("-4x",differentiate("-2x^2"));
    assert.deepEqual("1-4x",differentiate("x-2x^2"));
    assert.deepEqual("1+4x",differentiate("x+2x^2"));
    // display derivative string with higher exponent in front
}
