/*eslint-env mocha */
'use strict';

const assert = require('assert');
const docRouter = require('../');
const GraphDescriptor = require('./');
const React = require('react');
const reactDomServer = require('react-dom/server');

describe('graph-descriptor-node', () => {

  it('should render to string', () => {
    const descriptor = docRouter.createClass([{
      route: 'users[{keys:id}]["username","email","bio"]',
      returns: 'string',
      get() {},
      set() {}
    }, {
      route: 'users[{keys:id}]follower_list.length',
      returns: 'integer',
      get() {}
    }, {
      route: 'users[{keys:id}]follower_list[{ranges:indices}]',
      returns: 'reference into ["user", id]',
      get() {}
    }]).descriptor();
    const reactEl = React.createElement(GraphDescriptor, { descriptor });
    const html = reactDomServer.renderToStaticMarkup(reactEl);
    assert.strictEqual(typeof html, 'string');
    //console.log(html)
  });
});
