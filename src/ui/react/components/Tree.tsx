import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TreeNode } from 'utils/data-structure/TreeNode';

interface TreeProps<T extends string> {
  node: TreeNode<T>;
  onAddChildNode: (node: TreeNode<T>) => void;
  onRemoveNode: (node: TreeNode<T>) => void;
  onChangeNode: (newValue: string, oldValue: string) => void;
  checkedNodeId: T | null;
  onCheckboxChange: (node: TreeNode<T>) => void;
}

const TreeComponent = <T extends string>({
  node,
  onAddChildNode,
  onRemoveNode,
  onChangeNode,
  checkedNodeId,
  onCheckboxChange,
}: TreeProps<T>) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState(node.data.toString());
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const hasChildren = node.children.length > 0;

  // Hover
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Input
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    const oldValue = node.data.toString();
    setInputValue(value);

    // Clear the previous debounce timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new debounce timeout
    const newTimeout = setTimeout(() => {
      if (oldValue !== value) {
        // Pass the old node value along with the new value
        onChangeNode(value, oldValue);
      }
    }, 1000);
    setDebounceTimeout(newTimeout);
  };

  // Chexbox Input
  const handleCheckboxChange = () => {
    onCheckboxChange(node);
  };

  // Debounce
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  return (
    <div className="tree-vertical">
      <div className="tree-node-container">
        {node.parent && (
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="tree-node" id={`node-${node.id}`}>
              <div className="tree-node-header">
                <div className="tree-node-x" onClick={() => onRemoveNode(node)}>x</div>
                <input
                  type="checkbox"
                  checked={checkedNodeId === node.id}
                  onChange={handleCheckboxChange}
                />
              </div>

              <div className="tree-node-data">
                <textarea
                  rows={2}
                  value={inputValue}
                  onChange={handleInputChange}
                  className="tree-node-input"
                />
              </div>
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
            onRemoveNode={onRemoveNode}
            onChangeNode={onChangeNode}
            checkedNodeId={checkedNodeId}
            onCheckboxChange={onCheckboxChange}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(TreeComponent);
