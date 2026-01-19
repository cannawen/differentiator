const assert = require("assert");

// pass in command line arg to enable tests
const TESTING = process.argv[2];

class Term {
    constructor(coefficient, exponent) {
        this.coefficient = parseInt(coefficient);
        this.exponent = parseInt(exponent);
    }

    static parseTerms(equationString) {
        return equationString
            .matchAll(/(-?\d+?)x?(\^(\d)+)?/g)
            .map(match => new Term(match[1] || 1, match[3] || 0));
    }

    static derivative(term) {
        if (term.exponent === 0) {
            return new Term(0, 0);
        }
        return new Term(term.coefficient * term.exponent, term.exponent - 1);
    }

    static merge(termA, termB) {
        // Could remove this assert and just return termA termB as two separate arrays and flatMap it outside
        assert.deepEqual(termA.exponent, termB.exponent, "Unable to merge two terms with different exponents")
        return new Term(termA.coefficient + termB.coefficient, termA.exponent);
    }

    static compare(termA, termB) {
        return termB.exponent - termA.exponent;
    }

    static toString(term) {
        let returnString = ""
        if (Math.abs(term.coefficient) === 1  && term.exponent === 0) {
            returnString += term.coefficient;
        }
        if (Math.abs(term.coefficient) > 1) {
            returnString += term.coefficient;
        }
        if (term.exponent > 0) {
            returnString += "x";
        }
        if (term.exponent > 1) {
            returnString += "^" + term.exponent
        }
        return returnString;
    }
}

class Equation {
    // this.terms is an object mapping {exponent: Term of the same exponent}
    constructor(termsArray) {
        this.terms = termsArray
            .reduce((memo, term) => {
                if (memo[term.exponent] === undefined) {
                    memo[term.exponent] = term;
                } else {
                    memo[term.exponent] = Term.merge(memo[term.exponent], term);
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
        return new Equation(Term.parseTerms(postProcessedEquation))
    }

    static derivative(equation) {
        return new Equation(Object.values(equation.terms).map(Term.derivative));
    }

    static toString(equation) {
        const equationString = Object.values(equation.terms)
            .sort(Term.compare)
            .map(Term.toString)
            .reduce((memo, term) => {
                memo += "+" + term;
                return memo;
            }, "")

        if (equationString === "+" || equationString === undefined) return "0";
        
        return equationString
            .replace(/^\+/,"")
            .replace(/\+-/g, "-")
            .replace(/1x/g, "x");
    }

    differentiate() {
        return Equation.derivative(this);
    }

    toString() {
        return Equation.toString(this);
    }
}

// --------------- OLD CODE ------------------

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
}

function toDerivativeString(terms) {
    return terms
        .sort((termA, termB) => termB[0] - termA[0])
        .reduce((memo, [exponent, coefficient]) => {
            // Checking if coef is 0 should probably happen earlier? Like a simplify step?
            if (coefficient === 0) return memo;
            
            memo += "+" + coefficient
            switch (exponent) {
                case 0:
                    break;
                case 1:
                    memo += "x";
                    break;
                default:
                    memo += "x^" + exponent;
                    break;
            }
            return memo;
        }, "");
}

function postProcess(equation) {
    if (equation === "") return "0";
    return equation
        .replace(/^\+/,"")
        .replace(/\+-/g, "-")
        .replace(/1x/g, "x");
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

function preprocess(equation) {
    return equation
        .replaceAll(/\s/g,"")
        .replaceAll(/-x/g,"-1x")
        .replaceAll(/(?<!\d)x/g, "1x")
        .replaceAll(/x(?!\^)/g, "x^1")
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
