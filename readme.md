# Self-Documenting Falcor Router

**Warning: This project is not yet in a coherent state. Please check back soon.**

This lib is drop-in replacement for `FalcorRouter.createClass()`. The resulting class has one additional static method `.descriptor()` which returns a JSON object containing metadata about your JSON graph. This object can then be used to render documentation for your Falcor JSON graph.

A `GraphDescriptor` React component is also provided which can be used to render a view of that object.

## Installation

```
npm install falcor-doc-router
```

## Usage

```js
// in node.js
var docRouter = require('falcor-doc-router');
var reactDomServer = require('react-dom/server');
var GraphDescriptor = require('falcor-doc-router/graph-descriptor');
var React = require('react');
var Router = docRouter.createClass([ ...your routes... ]);
var descriptor = Router.descriptor();
var reactEl = React.createElement(GraphDescriptor, { descriptor });
var html = reactDomServer.renderToString(reactEl);
```
