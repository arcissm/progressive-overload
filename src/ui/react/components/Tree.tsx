import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TreeNode } from 'utils/data-structure/TreeNode';


interface TreeProps<T extends React.Key> {
    node: TreeNode<T>;
    onAddChildNode: (node: TreeNode<T>) => void;
    onAddSiblingNode: (node: TreeNode<T>) => void;
    onRemoveNode: (node: TreeNode<T>) => void;
    onChangeNode: (node: TreeNode<T>, newValue: string) => void;
    checkedNodeId: T | null; // Add this prop to track checked state
    onCheckboxChange: (node: TreeNode<T>) => void; // Add this prop for the change handler
  }
  
  const TreeComponent = <T extends React.Key>({
    node,
    onAddChildNode,
    onAddSiblingNode,
    onRemoveNode,
    onChangeNode,
    checkedNodeId,
    onCheckboxChange,
  }: TreeProps<T>) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasChildren = node.children.length > 0;
  
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
  
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeNode(node, event.target.value);
    };
  
    const handleCheckboxChange = () => {
      onCheckboxChange(node);
    };
  
    return (
      <div className="tree-vertical">
        <div className="tree-node-container">
          {node.parent && (
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <div className="tree-node" id={`node-${node.data}`}>
                <div className="tree-node-header">
                  <div className="tree-node-x" onClick={() => onRemoveNode(node)}>x</div>
                  <input
                    type="checkbox"
                    checked={checkedNodeId === node.data} // Check if this node is the checked one
                    onChange={handleCheckboxChange} // Call the change handler
                  />
                </div>
                
                <div className="tree-node-data">
                  <textarea 
                    rows={2}
                    value={node.data.toString()}
                    onChange={handleInputChange}
                    className="tree-node-input"
                  />
                </div>
              </div>
                
              <div className="tree-add-sibling-container">
                {isHovered && (
                  <button className="edge-add-button" onClick={() => onAddSiblingNode(node)}>
                    <FontAwesomeIcon icon={faPlus} size="2x" />
                  </button>
                )}
              </div>
  
              <div className="edge-container">
                {isHovered && (
                  <button className="edge-add-button" onClick={() => onAddChildNode(node)}>
                    <FontAwesomeIcon icon={faPlus} size="2x" />
                  </button>
                )}
                <div className={hasChildren ? 'edge' : 'last-edge'}></div>
              </div>
            </div>
          )}
        </div>
  
        <div className="tree-horizontal">
          {node.children.map((childNode) => (
            <TreeComponent
              key={childNode.data}
              node={childNode}
              onAddChildNode={onAddChildNode}
              onAddSiblingNode={onAddSiblingNode}
              onRemoveNode={onRemoveNode}
              onChangeNode={onChangeNode}
              checkedNodeId={checkedNodeId} // Pass checkedNodeId down
              onCheckboxChange={onCheckboxChange} // Pass onCheckboxChange down
            />
          ))}
        </div>
      </div>
    );
  };
    

export default React.memo(TreeComponent);
