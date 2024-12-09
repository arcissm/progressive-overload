import React, { useEffect, useState } from "react";
import { useWorkoutController } from "../../../controller/ConfigControllerProvider";
import { Tree } from "utils/data-structure/Tree"; // Make sure this path is correct
import TreeCompoenent from "../components/Tree"; // Assuming this is your Tree component from the previous example
import { TreeNode } from "utils/data-structure/TreeNode";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SingleSelect from "../components/SingleSelect";
import PanelLayout from "../components/PanelLayout";
import Collapse from "../components/Collapse";

const VariationPanel: React.FC = () => {
  const controller = useWorkoutController();
  const [variations, setVariations] = useState<Map<string, Tree<string>>>();
  const [exercises, setExercises] = useState<string[]>([]); 
  const [checkedNodes, setCheckedNodes] = useState<Map<string, string | null>>(new Map());
  const [editingVariations, setEditingVariations] = useState<Map<string, string>>(new Map());
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);


  // Load the variations when the component mounts
  useEffect(() => {
    const loadTrees = async () => {
      const fetchedVariations = controller.getVariations();
      const updatedCheckedNodes = new Map<string, string | null>();

      for (const [rootName, tree] of fetchedVariations.entries()) {
        const checkedVariation = controller.getVariationForExercise(rootName);

        if (checkedVariation) {
          const checkedNode = tree.findNode(checkedVariation);
          if (checkedNode) {
            updatedCheckedNodes.set(rootName, checkedNode.id);
          }
        } else {
          updatedCheckedNodes.set(rootName, null);
        }
      }

      const fetchedExercises = controller.getExercises()
      const stringExercises = fetchedExercises.map(exercise => exercise.name)

      setVariations(fetchedVariations);
      setExercises(stringExercises)
      setCheckedNodes(updatedCheckedNodes);
    };

    loadTrees();
  }, [controller]);

  // Add Variation
  const handleAddVariation = () => {
    const updatedVariations = controller.addTree();
    setVariations(new Map(updatedVariations));
  };

  
  // Delete Variation
  const handleDeleteVariation = (root: string) => {
    const updatedVariations = controller.deleteTree(root);
    setVariations(new Map(updatedVariations));
  }

  // Update
  const handleExerciseNameChange = (selectedName: string, rootNode: TreeNode<string>) => {
    const oldName = rootNode.data;

    const newEditingVariations = new Map(editingVariations);
    newEditingVariations.set(rootNode.data, selectedName);
    setEditingVariations(newEditingVariations);
  
  
    // Clear previous debounce timeout if it exists
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  
    // Set a new debounce timeout
    const newTimeout = setTimeout(() => {
      if (oldName !== selectedName) {
        controller.setVariationForExercise(oldName, selectedName);
        const updatedVariations = controller.updateExerciseForVariation(oldName, selectedName);
        setVariations(new Map(updatedVariations));      
        }
      }, 1000);

  setDebounceTimeout(newTimeout);
  };

  // Debounce
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  // Add Node
  const handleAddChildNode = (exerciseName: string, node: TreeNode<string>) => {
    const updatedVariations = controller.addNode(exerciseName, node);
    setVariations(new Map(updatedVariations));
  };

  // Delete Node
  const handleRemoveNode = (exerciseName: string, node: TreeNode<string>) => {
    const updatedVariations = controller.removeNode(exerciseName, node);
    setVariations(new Map(updatedVariations)); 
  }

  // Chande Node
  const handleChangeNode = (exerciseName: string, newValue: string, oldValue: string) => {
    const updatedVariations = controller.updateVariationName(exerciseName, oldValue, newValue);
    setVariations(new Map(updatedVariations));
  }
  
  // Checkbox Node
  const handleCheckboxChange = (exerciseName: string, node: TreeNode<string>) => {
    setCheckedNodes((prevCheckedNodes) => {
      const newCheckedNodes = new Map(prevCheckedNodes);
      const currentCheckedNode = newCheckedNodes.get(exerciseName);
      let checkedVariaiton = exerciseName;

      if (currentCheckedNode === node.id) {
        newCheckedNodes.set(exerciseName, null);
      } else {
        newCheckedNodes.set(exerciseName, node.id);
        checkedVariaiton = node.data;
      }

      controller.setVariationForExercise(exerciseName, checkedVariaiton);
      return newCheckedNodes;
    });
  };




  


  return (
    <PanelLayout
      title="Exercise Variations"
      description="Add, Remove or Edit workout types"
      footerAction={handleAddVariation}
      displayFooter={true} >
    

      {variations ? (
        Array.from(variations.entries()).map(([name, tree]) => {
        const editingValue = editingVariations.get(tree.root.data) || tree.root.data;

          return (
            <div className="workout-settings-variations-container" key={name}>

                  <div className="workout-settings-variations-container-header">
                    <div className="workout-settings-variations-container-header-title">
                      <SingleSelect
                        options={exercises || []}
                        selectedValue={name}
                        onSelectionChange={(selected) => handleExerciseNameChange(selected, tree.root)}
                        />
                    </div>
                      <button 
                        className="workout-settings-variations-container-header-title-trash workout-settings-table-button"
                        onClick={() => handleDeleteVariation(tree.root.data)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                  </div>
                  <div className="first-edge-container">
                    <button onClick={() => handleAddChildNode(tree.root.data, tree.root)}>
                      <FontAwesomeIcon icon={faPlus} size="2x" />
                    </button>
                </div>

              <Collapse 
              header={

                <div className="first-edge-container">
                  <div className="edge"></div>
                </div>

              }>
                <TreeCompoenent
                  node={tree.root}
                  onAddChildNode={(node) => handleAddChildNode(tree.root.data, node)}
                  onRemoveNode={(node) => handleRemoveNode(tree.root.data, node)}
                  onChangeNode={(newValue, oldValue) => handleChangeNode(tree.root.data, newValue, oldValue)}
                  onCheckboxChange={(node) => handleCheckboxChange(tree.root.data, node)}
                  checkedNodeId={checkedNodes.get(name) || null}
                />
              </Collapse>
            </div>
          );
        })
      ) : (
        <p>Loading variations...</p>
      )}
  </PanelLayout>
  );
};


export default VariationPanel;
