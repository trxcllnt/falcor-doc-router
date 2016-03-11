/*eslint-env mocha */
'use strict';

const assert = require('assert');
const docRouter = require('../');
const GraphDescriptorNode = require('./graph-descriptor-node');
const React = require('react');
const reactDomServer = require('react-dom/server');
const cheerio = require('cheerio');

describe('graph-descriptor-node', () => {

  it('should render to string', () => {
    const html = stringify([{ route: 'foo.bar' }]);
    assert.strictEqual(typeof html, 'string');
  });

  it('should render a li at root', () => {
    const $ = $ify([{ route: 'foo.bar' }]);
    assert.strictEqual($(':root')[0].name, 'li');
  });
});

function stringify(routes) {
  const descriptor = docRouter.createClass(routes).descriptor();
  const reactEl = React.createElement(GraphDescriptorNode, { node: descriptor });
  const html = reactDomServer.renderToStaticMarkup(reactEl);
  return html;
}

function $ify(routes) {
  const html = stringify(routes);
  const $ = cheerio.load(html);
  return $;
}
