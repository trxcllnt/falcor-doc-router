/*eslint-env mocha */
'use strict';

const assert = require('assert');
const docRouter = require('../');
const GraphDescriptorNode = require('./graph-descriptor-node');
const React = require('react');
const reactDomServer = require('react-dom/server');

describe('graph-descriptor-node', () => {

  it('should render to string', () => {
    const descriptor = docRouter.createClass([{
      route: 'foo.bar'
    }]).descriptor();
    const reactEl = React.createElement(GraphDescriptorNode, { node: descriptor });
    const html = reactDomServer.renderToStaticMarkup(reactEl);
    assert.strictEqual(typeof html, 'string');
    //console.log(html)
  });
});
