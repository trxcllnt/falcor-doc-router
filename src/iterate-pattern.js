'use strict';

const parse = require('falcor-path-syntax');

/*
 * Given an array returned from parsing a route pattern, which may contain
 * nested arrays, return an iterator over path patterns which don't contain
 * nested arrays.
 *
 * E.G.
 * <= ['foo',['bar','baz']]
 * => ['foo','bar']
 * => ['foo','baz']
 */

module.exports = function iteratePattern(pattern) {
  const parsedPattern = parse(pattern, true);
  return iterateParsedPattern(parsedPattern);
};

function* iterateParsedPattern(parsedPathPattern, pointer, path) {
  pointer = pointer === undefined ? 0 : pointer;
  path = path || [];
  if (pointer >= parsedPathPattern.length) {
    yield path.slice().map(mapper);
  } else {
    const thing = parsedPathPattern[pointer];
    for (const x of iterateItem(thing)) {
      path.push(x);
      yield* iterateParsedPattern(parsedPathPattern, pointer + 1, path);
      path.pop();
    }
  }
}

function* iterateItem(thing) {
  if (Array.isArray(thing)) {
    for (const subthing of thing) {
      yield* iterateItem(subthing);
    }
  } else {
    yield thing;
  }
}

function mapper(thing) {
  if (typeof thing === 'string') {
    return { name: thing };
  } else {
    return { name: `{${thing.type}}`, wildcard: thing };
  }
}
