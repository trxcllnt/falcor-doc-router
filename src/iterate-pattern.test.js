/*eslint-env mocha */
'use strict';

const iteratePattern = require('./iterate-pattern');
const assert = require('assert');

describe('iteratePattern', () => {

  it('should iterate a one-level-deep pattern', () => {
    const pattern = 'foo';
    const result = Array.from(iteratePattern(pattern));
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].length, 1);
    assert.strictEqual(result[0][0].name, 'foo');
  });

  it('should iterate a two-level-deep pattern', () => {
    const pattern = 'foo.bar';
    const result = Array.from(iteratePattern(pattern));
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].length, 2);
    assert.strictEqual(result[0][0].name, 'foo');
    assert.strictEqual(result[0][1].name, 'bar');
  });

  it('should capture {keys} wildcards', () => {
    const pattern = '[{keys}]';
    const result = Array.from(iteratePattern(pattern));
    assert.strictEqual(result[0].length, 1);
    assert.strictEqual(result[0][0].name, '{keys}');
    assert(!result[0][0].wildcard.name);
    assert.strictEqual(result[0][0].wildcard.type, 'keys');
  });

  it('should capture named {keys} wildcards', () => {
    const pattern = '[{keys:foo}]';
    const result = Array.from(iteratePattern(pattern));
    assert.strictEqual(result[0].length, 1);
    assert.strictEqual(result[0][0].name, '{keys}');
    assert.strictEqual(result[0][0].wildcard.name, 'foo');
    assert.strictEqual(result[0][0].wildcard.type, 'keys');
  });

  it('should capture {integers} wildcards', () => {
    const pattern = '[{integers}]';
    const result = Array.from(iteratePattern(pattern));
    assert.strictEqual(result[0].length, 1);
    assert.strictEqual(result[0][0].name, '{integers}');
    assert(!result[0][0].wildcard.name);
    assert.strictEqual(result[0][0].wildcard.type, 'integers');
  });

  it('should capture named {integers} wildcards', () => {
    const pattern = '[{integers:foo}]';
    const result = Array.from(iteratePattern(pattern));
    assert.strictEqual(result[0].length, 1);
    assert.strictEqual(result[0][0].name, '{integers}');
    assert.strictEqual(result[0][0].wildcard.name, 'foo');
    assert.strictEqual(result[0][0].wildcard.type, 'integers');
  });

  it('should capture {ranges} wildcards', () => {
    const pattern = '[{ranges}]';
    const result = Array.from(iteratePattern(pattern));
    assert.strictEqual(result[0].length, 1);
    assert.strictEqual(result[0][0].name, '{ranges}');
    assert(!result[0][0].wildcard.name);
    assert.strictEqual(result[0][0].wildcard.type, 'ranges');
  });

  it('should capture named {ranges} wildcards', () => {
    const pattern = '[{ranges:foo}]';
    const result = Array.from(iteratePattern(pattern));
    assert.strictEqual(result[0].length, 1);
    assert.strictEqual(result[0][0].name, '{ranges}');
    assert.strictEqual(result[0][0].wildcard.name, 'foo');
    assert.strictEqual(result[0][0].wildcard.type, 'ranges');
  });

  it('should capture wildcards at position 0', () => {
    const pattern = '[{keys}].foo';
    const result = Array.from(iteratePattern(pattern));
    assert.strictEqual(result[0].length, 2);
    assert.strictEqual(result[0][0].name, '{keys}');
  });

  it('should capture wildcards at position 1', () => {
    const pattern = 'foo[{keys}]';
    const result = Array.from(iteratePattern(pattern));
    assert.strictEqual(result[0].length, 2);
    assert.strictEqual(result[0][1].name, '{keys}');
  });
});
