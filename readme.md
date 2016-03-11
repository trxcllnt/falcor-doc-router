# Self-Documenting Falcor Router

This lib is drop-in replacement for [`FalcorRouter.createClass()`](https://github.com/Netflix/falcor-router).
The resulting class can be used to create Falcor router instances per usual, but has one additional static method `.descriptor()` which returns a JSON object containing metadata about your JSON graph.
This metadata is assembled using only information you provide in the routes array passed to `createClass`.
This descriptor object can then be used to render documentation for your Falcor JSON graph.

A `GraphDescriptor` React component is also provided which can be used to render an HTML view of that object.

## Installation

```
npm install falcor-doc-router
```

## Requirements

This lib is designed to run on Node.js 4.x and higher.
The react components are run through the `es2015` and `react` babel presets before publish, so will run inside all modern JS engines.

## Usage Example

```js
// in node.js
var reactDomServer = require('react-dom/server');
var React = require('react');
var docRouter = require('falcor-doc-router');
var GraphDescriptor = require('falcor-doc-router/graph-descriptor');

// This is a server-side rendering example but it
// could also be rendered on the client using the
// same react component.
var Router = docRouter.createClass([ ...your routes... ]);
var descriptor = Router.descriptor();
var reactEl = React.createElement(GraphDescriptor, { descriptor });
var html = reactDomServer.renderToStaticMarkup(reactEl);
```
