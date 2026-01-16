const assert = require('assert');

assert.strictEqual(0,derivative("2"));
assert.strictEqual(2,derivative("2x"));

// assume variable is always named x
function derivative(i) {
    return 0;
}
