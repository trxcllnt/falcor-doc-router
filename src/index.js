'use strict';

const FalcorRouter = require('falcor-router');
const iteratePattern = require('./iterate-pattern');

/*
 * Create a Falcor Router class with a .descriptor() static method, which
 * returns an object of the form:
 *
 *   {
 *     name: <string>,
 *     wildcard: 'keys' | 'integers' | 'ranges',
 *     isLeaf: <boolean>,
 *     isReadable: <boolean>,
 *     isWritable: <boolean>,
 *     isCallable: <boolean>,
 *     children: [recurse, recurse, ...]
 *   }
 */

exports.createClass = function(routes) {
  const intermediate = transformToIntermediate(routes);
  const final = transformToFinal(intermediate, 'jsonGraph');
  const router = FalcorRouter.createClass.apply(FalcorRouter, arguments);
  router.descriptor = function() {
    return final;
  };
  return router;
};

function transformToIntermediate(routes) {
  const desc = {};
  for (const route of routes) {
    for (const path of iteratePattern(route.route)) {
      let curDesc = desc;
      let leaf;
      for (const step of path) {
        const name = step.name;
        if (!curDesc.hasOwnProperty(name)) {
          curDesc[name] = {};
        }
        leaf = curDesc = curDesc[name];
        if (step.wildcard) {
          curDesc['__meta'] = {
            isWildcard: true,
            wildcardType: step.wildcard.type,
            wildcardNamed: step.wildcard.named,
            wildcardName: step.wildcard.name,
          };
        }
      }
      if (!leaf.hasOwnProperty('__meta')) {
        leaf['__meta'] = {};
      }
      const leafMeta = leaf['__meta'];
      leafMeta.isLeaf = true;
      if (route.returns) { leafMeta.leafReturns = route.returns; }
      leafMeta.isReadable = typeof route.get === 'function';
      leafMeta.isWritable = typeof route.set === 'function';
      leafMeta.isCallable = typeof route.call === 'function';
    }
  }
  return desc;
}

function transformToFinal(desc, name) {
  const final = {};
  final.name = name;
  for (const prop of Object.keys(desc)) {
    if (prop === '__meta') {
      const meta = desc[prop];
      if (meta.isLeaf) {
        final.isLeaf = true;
        if (meta.isReadable) {
          final.isReadable = true;
        }
        if (meta.isWritable) {
          final.isWritable = true;
        }
        if (meta.isCallable) {
          final.isCallable = true;
        }
        if (meta.leafReturns) {
          final.returns = meta.leafReturns;
        }
      }
      if (meta.isWildcard) {
        final.isWildcard = true;
        final.name = ':' + (meta.wildcardName || meta.wildcardType);
        final.wildcard = meta.wildcardType;
      }
    } else {
      const subDesc = desc[prop];
      if (!final.children) {
        final.children = [];
      }
      final.children.push(transformToFinal(subDesc, prop));
    }
  }
  if (final.children) {
    final.children.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      else if (a.name === b.name) { return 0; }
      else if (a.name > b.name) { return 1; }
      else { return 0; }
    });
  }
  return final;
}
