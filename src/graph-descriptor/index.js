'use strict';

const React = require('react');
const GraphDescriptorNode = require('./graph-descriptor-node');

const noChildren = [];

module.exports = class GraphDescriptor extends React.Component {

  render() {

    const descriptor = this.props.descriptor;
    const children = descriptor ? descriptor.children : noChildren;

    return <div className="graph-descriptor">
      <h2>JSON Graph Documentation</h2>
      <p>
        Note: Leaf nodes are shown as <strong className="leaf-color">this</strong>.
        Nodes preceded by a <strong>:color</strong> are wildcards that match multiple values.
      </p>
      <ul>
        {children.map((child, idx) =>
          <GraphDescriptorNode
            key={child.name}
            node={child}
            steps={[idx === children.length - 1]}
          />
        )}
      </ul>
    </div>;
  }
};
