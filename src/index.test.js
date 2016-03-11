/*eslint-env mocha */
'use strict';

const assert = require('assert');
const Router = require('.');

describe('self documenting router', () => {

  it('should have a descriptor function', () => {
    const router = Router.createClass([{
      route: 'path.to[{keys:values}]'
    }]);
    assert.strictEqual(typeof router.descriptor, 'function');
  });

  it('descriptor should return an object', () => {
    const router = Router.createClass([{
      route: 'path.to[{keys:values}]'
    }]);
    assert.strictEqual(typeof router.descriptor(), 'object');
  });

  it('should describe top level simple routes', () => {
    const descriptor = Router.createClass([{
      route: 'foo'
    }]).descriptor();
    assert.deepEqual(descriptor.children.map(ch => ch.name), ['foo']);
  });

  it('should describe top level complex routes', () => {
    const descriptor = Router.createClass([{
      route: '["foo","bar"]'
    }]).descriptor();
    assert.deepEqual(descriptor.children.map(ch => ch.name), ['foo','bar']);
  });

  it('should describe second level simple routes', () => {
    const descriptor = Router.createClass([{
      route: 'foo.bar'
    }]).descriptor();
    assert.deepEqual(descriptor.children[0].children.map(ch => ch.name), ['bar']);
  });

  it('should describe second level complex routes', () => {
    const descriptor = Router.createClass([{
      route: 'foo["bar","baz"]'
    }]).descriptor();
    assert.deepEqual(descriptor.children[0].children.map(ch => ch.name), ['bar','baz']);
  });

  it('should describe first and second level complex routes', () => {
    const descriptor = Router.createClass([{
      route: '["foo","bar"]["baz","qux"]'
    }]).descriptor();
    assert.deepEqual(descriptor.children.map(ch => ch.name), ['foo','bar']);
    assert.deepEqual(descriptor.children[0].children.map(ch => ch.name), ['baz','qux']);
    assert.deepEqual(descriptor.children[1].children.map(ch => ch.name), ['baz','qux']);
  });

  it('should identify top level leaves', () => {
    const descriptor = Router.createClass([{
      route: 'foo'
    }]).descriptor();
    assert(descriptor.children[0].isLeaf);
  });

  it('should identify second level leaves', () => {
    const descriptor = Router.createClass([{
      route: 'foo.bar'
    }]).descriptor();
    assert(descriptor.children[0].children[0].isLeaf);
  });

  it('should not identify branches as leaves', () => {
    const descriptor = Router.createClass([{
      route: 'foo.bar'
    }]).descriptor();
    assert(!descriptor.children[0].isLeaf);
  });

  it('should describe a wildcard', () => {
    const descriptor = Router.createClass([{
      route: 'foo[{keys}]'
    }]).descriptor();
    assert.strictEqual(descriptor.children[0].children[0].name, ':keys');
    assert.strictEqual(descriptor.children[0].children[0].wildcard, 'keys');
  });

  it('should describe a named wildcard', () => {
    const descriptor = Router.createClass([{
      route: 'foo[{keys:blah}]'
    }]).descriptor();
    assert.strictEqual(descriptor.children[0].children[0].name, ':blah');
    assert.strictEqual(descriptor.children[0].children[0].wildcard, 'keys');
  });

  it('should describe return', () => {
    const descriptor = Router.createClass([{
      route: 'foo',
      returns: 'stuff'
    }]).descriptor();
    assert.strictEqual(descriptor.children[0].returns, 'stuff');
  });

  it('should describe get', () => {
    const descriptor = Router.createClass([{
      route: 'foo',
      get() {}
    }]).descriptor();
    assert.strictEqual(descriptor.children[0].isReadable, true);
    assert.strictEqual(!descriptor.children[0].isWritable, true);
    assert.strictEqual(!descriptor.children[0].isCallable, true);
  });

  it('should describe set', () => {
    const descriptor = Router.createClass([{
      route: 'foo',
      set() {}
    }]).descriptor();
    assert.strictEqual(!descriptor.children[0].isReadable, true);
    assert.strictEqual(descriptor.children[0].isWritable, true);
    assert.strictEqual(!descriptor.children[0].isCallable, true);
  });

  it('should describe call', () => {
    const descriptor = Router.createClass([{
      route: 'foo',
      call() {}
    }]).descriptor();
    assert.strictEqual(!descriptor.children[0].isReadable, true);
    assert.strictEqual(!descriptor.children[0].isWritable, true);
    assert.strictEqual(descriptor.children[0].isCallable, true);
  });

  it('should describe get, set, call', () => {
    const descriptor = Router.createClass([{
      route: 'foo',
      get() {},
      set() {},
      call() {}
    }]).descriptor();
    assert.strictEqual(descriptor.children[0].isReadable, true);
    assert.strictEqual(descriptor.children[0].isWritable, true);
    assert.strictEqual(descriptor.children[0].isCallable, true);
  });

  it('should describe nested wildcards', () => {
    const descriptor = Router.createClass([{
      route: 'foo[{keys}][{keys}]'
    }]).descriptor();
    assert.strictEqual(descriptor.children[0].children[0].children[0].wildcard, 'keys');
  });

  it('should describe ovrlapping routes', () => {
    const descriptor = Router.createClass([{
      route: 'foo[{keys}][{keys:foo}]'
    },{
      route: 'foo.bar'
    }]).descriptor();
    assert.strictEqual(descriptor.children.length, 1);
    assert.strictEqual(descriptor.children[0].name, 'foo');
    assert.strictEqual(descriptor.children[0].children.length, 2);
    assert.strictEqual(descriptor.children[0].children[0].children.length, 1);
    assert.strictEqual(descriptor.children[0].children[1].name, 'bar');
    assert.strictEqual(descriptor.children[0].children[0].children[0].name, ':foo');
  });

  it('should create a falcor router class among other things', () => {
    const MyRouter = Router.createClass([{
      route: 'foo',
      get() {},
      set() {},
      call() {}
    }]);
    assert.strictEqual(typeof MyRouter.prototype.get, 'function');
  });
});
