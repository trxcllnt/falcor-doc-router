
import React from 'react';

const identity = x => x;

export default class GraphDescriptorNode extends React.Component {

  render() {

    const steps = this.props.steps;
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
        name: 'returns',
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
        <span className="tree-stuff">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            if (isLast) { return step ? '└─' : '├─'; }
            else { return step ? '  ' : '│ '; }
          })}
        </span>
        <strong>{name}</strong>
        {isWildcard || isLeaf &&
          <span className="node-info">
            ({ descriptors.map(d => `${d.name}: ${d.value}`).join(', ')})
          </span>
        }
      </span>
      {hasChildren &&
        <ul>
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
}
