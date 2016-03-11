'use strict';

const React = require('react');
const style = require('./style');

const identity = x => x;
const defaultSteps = [];

module.exports = class GraphDescriptorNode extends React.Component {

  render() {

    const steps = this.props.steps || defaultSteps;
    const node = this.props.node;
    const name = node.name;
    const children = node.children;
    const hasChildren = children && children.length > 0;
    const isLeaf = node.isLeaf;
    const isWildcard = node.isWildcard;
    const descriptors = [];

    if (isWildcard) {
      let wildcardDesc;
      if (node.wildcard === 'keys') {
        wildcardDesc = 'any value';
      } else if (node.wildcard === 'integers') {
        wildcardDesc = 'integers';
      } else if (node.wildcard === 'ranges') {
        wildcardDesc = 'ranges of integers';
      }
      descriptors.push({
        name: 'matches',
        value: wildcardDesc
      });
    }

    if (isLeaf) {
      descriptors.push({
        name: 'type',
        value: node.returns || 'unspecified'
      });
      let ops = [
        node.isReadable && 'readable',
        node.isWritable && 'writable',
        node.isCallable && 'callable'
      ]
      .filter(identity)
      .join(', ');
      if (ops === 'readable') {
        ops = 'readonly';
      } else if (ops === 'readable, writable') {
        ops = 'read/write';
      }
      descriptors.push({
        name: 'access',
        value: ops
      });
    }

    return <li className={isLeaf ? 'is-leaf' : 'is-branch'}>
      <span className="node-line">
        <span className="tree-stuff" style={{whiteSpace:'pre',fontFamily:'"courier new",monospace'}}>
          {steps.map((step, idx) => {
            // "steps" is an array of booleans representing the path to here
            // from root. "true" means the node in that position was last among
            // its siblings. This enables drawing the "tree stuff".
            const isAdjacent = idx === steps.length - 1;
            if (isAdjacent) { return !step ? '├─' : '└─'; }
            else { return !step ? '│ ' : '  '; }
          }).join('')}
        </span>
        <strong className={isLeaf?'leaf-color':undefined} style={{color:isLeaf?style.color.leaf:'inherit'}}>{name}</strong>
        {(isWildcard || isLeaf) &&
          <span className="node-info"> ({ descriptors.map(d => `${d.name}: ${d.value}`).join(', ')})</span>
        }
      </span>
      {hasChildren &&
        <ul style={{margin:0,padding:0,listStyle:'none'}}>
          {children.map((subchild, idx) => {
            const isLast = idx === children.length - 1;
            const substeps = steps.slice();
            substeps.push(isLast);
            return <GraphDescriptorNode
              key={subchild.name}
              node={subchild}
              steps={substeps}
            />;
          })}
        </ul>
      }
    </li>;
  }
};
