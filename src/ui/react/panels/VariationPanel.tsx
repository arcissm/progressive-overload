import React, { useEffect, useState } from "react";
import { useWorkoutController } from "../../../controller/WorkoutControllerProvider";
import { Tree } from "utils/data-structure/Tree"; // Make sure this path is correct
import TreeCompoenent from "../components/Tree"; // Assuming this is your Tree component from the previous example
import { TreeNode } from "utils/data-structure/TreeNode";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WorkoutPanel: React.FC = () => {
  const controller = useWorkoutController();
  const [variations, setVariations] = useState<Map<string, Tree<string>>>();
  const [checkedNodeId, setCheckedNodeId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

    
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Use useEffect to load the variations when the component mounts
  useEffect(() => {
    const loadTrees = async () => {
      const fetchedVariations = await controller.getVariations();
      setVariations(fetchedVariations);
    };

    loadTrees();
  }, [controller]);

  const handleAddVariation = () =>{
    console.log('Add full new Variaiton Tree');

  }

  const handleAddChildNode = (node: TreeNode<string>) => {
    console.log('Parent', node);
    // const newChild = new TreeNode('New Child'); // Create a new node
    // node.addChild(newChild); // Add to the parent node's children
  };

  const handleAddSiblingNode = (node: TreeNode<string>) => {
    console.log('Sibling', node);
    // const newChild = new TreeNode('New Child'); // Create a new node
    // node.addChild(newChild); // Add to the parent node's children
  };

  const handleRemoveNode = (node: TreeNode<string>) => {
    console.log('Removing', node);
  };

  const handleChangeNode = (node: TreeNode<string>) => {
    console.log('Changed', node);

  }

  const handleCheckboxChange = (node: TreeNode<string>) => {
    setCheckedNodeId(node.data as string);
    // Call the function you want when a checkbox is checked
    console.log(`Checkbox for node ${node.data} is checked.`);
  };


  

  return (
    <div className="workout-settings-panel">
      <div className="workout-settings-information">
        <h1>Exercise Variations</h1>
        <p>Add, Remove or Edit workout Type</p>
      </div>

      {variations ? (
        Array.from(variations.entries()).map(([name, tree]) => (
          <div className="workout-settings-variations-container" key={name}>
            <div className="workout-settings-variations-container-header" 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}>
              <div className="workout-settings-variations-container-header-title">
                <input
                  type="text"
                  placeholder="Search exercises"
                  value={name}
                  onChange={(e) => console.log(e)}
                />
              </div>

              <div className="first-edge-container">
                {isHovered && (
                  <button onClick={() => handleAddChildNode(tree.root)}>
                    <FontAwesomeIcon icon={faPlus} size="2x" />
                  </button>
                )}
                <div className='edge'></div>
              </div>
            </div>

            <TreeCompoenent 
              node={tree.root}
              onAddChildNode={handleAddChildNode}
              onAddSiblingNode={handleAddSiblingNode}
              onRemoveNode={handleRemoveNode}
              onChangeNode={handleChangeNode}
              onCheckboxChange={handleCheckboxChange} 
              checkedNodeId={null}/> 
          </div>
        ))
      ) : (
        <p>Loading variations...</p>
      )}

      <div className="workout-settings-table-footer">
        <button className="workout-settings-table-button" onClick={handleAddVariation}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </button>
      </div>
    </div>
  );
};

export default WorkoutPanel;
