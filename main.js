const assert = require("assert");

// pass in command line arg to enable tests
const TESTING = process.argv[2];

class Term {
    constructor(coefficient, exponent) {
        this.coefficient = parseInt(coefficient);
        this.exponent = parseInt(exponent);
    }

    static parseAllTerms(equationString) {
        return equationString
            .matchAll(/(-?\d+?)x?(\^(\d)+)?/g)
            .map(match => new Term(match[1] || 1, match[3] || 0));
    }

    derivative() {
        if (this.exponent === 0) {
            return new Term(0, 0);
        }
        return new Term(this.coefficient * this.exponent, this.exponent - 1);
    }

    merge(term) {
        assert.deepEqual(this.exponent, term.exponent, "Unable to merge two terms with different exponents")
        return new Term(this.coefficient + term.coefficient, this.exponent);
    }

    compare(term) {
        return term.exponent - this.exponent;
    }

    toString() {
        let returnString = ""
        if (Math.abs(this.coefficient) === 1  && this.exponent === 0) {
            returnString += this.coefficient;
        }
        if (Math.abs(this.coefficient) > 1) {
            returnString += this.coefficient;
        }
        if (this.exponent > 0) {
            returnString += "x";
        }
        if (this.exponent > 1) {
            returnString += "^" + this.exponent;
        }
        return returnString;
    }
}

class Equation {
    // this.terms is an object mapping {exponent: term, ...} 
    // where the term has the same exponent as the key
    constructor(termsArray) {
        this.terms = termsArray
            .reduce((memo, term) => {
                if (memo[term.exponent] === undefined) {
                    memo[term.exponent] = term;
                } else {
                    memo[term.exponent] = memo[term.exponent].merge(term);
                }
                return memo;
            }, {});
    }

    static parse(equationString) {
        const postProcessedEquation = equationString
            .replaceAll(/\s/g,"")
            .replaceAll(/-x/g,"-1x")
            .replaceAll(/(?<!\d)x/g, "1x")
            .replaceAll(/x(?!\^)/g, "x^1")
        return new Equation(Term.parseAllTerms(postProcessedEquation));
    }

    differentiate() {
        return new Equation(Object.values(this.terms).map(term => term.derivative()));
    }

    toString() {
        const equationString = Object.values(this.terms)
            .sort((termA, termB) => termA.compare(termB))
            .map(term => term.toString())
            .reduce((memo, term) => {
                memo += "+" + term;
                return memo;
            }, "");

        if (equationString === "+" || equationString === undefined) return "0";
        
        return equationString
            .replace(/^\+/,"")
            .replace(/\+-/g, "-")
            .replace(/1x/g, "x");
    }
}

// assume variable is always named x
function differentiate(equation) {
    return Equation.parse(equation).differentiate().toString();
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
    assert.deepEqual("-4x+1",differentiate("x-2x^2"));
    assert.deepEqual("4x+1",differentiate("x+2x^2"));
    assert.deepEqual("0",differentiate("4x^500-4x^500"));
    assert.deepEqual("0",differentiate("-0-0x^1-0x^0-0x"));
}
