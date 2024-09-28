import * as fs from 'fs';
import { VARIATION_DATA_PATH } from "utils/Constants";
import { Tree } from 'utils/data-structure/Tree';
import { TreeNode } from 'utils/data-structure/TreeNode';

export class VariationData {
	private dataPath: string;
	variations: Map<string, Tree<string>>; // Change to Map

	constructor(dirPath: string) {
		this.dataPath = dirPath + VARIATION_DATA_PATH;
		this.convertDataToTree(this.dataPath);
	}

// Function to print all the trees in the variations map using the iterator
printTrees() {
    console.log("Printing all trees:");
    this.variations.forEach((tree, key) => {
        console.log(`\nTree Root: ${key}`);
        
        // Using the iterator to go through each node in the tree
        for (const node of tree) {
            // Calculate the depth of the current node for indentation
            let depth = 0;
            let currentNode = node;
            while (currentNode.parent) {
                depth++;
                currentNode = currentNode.parent;
            }

            // Print the node with the appropriate indentation
            console.log(`${'--'.repeat(depth)}${node.data}`);
        }
    });
}


    // Function to save the Map data structure back to the JSON file
	saveTree() {
	    // Convert the variations Map back into the JSON structure
	    const dataToSave = Array.from(this.variations.values()).map(tree => {
	        const rootNode = tree.root;
	        
	        const variations: any[] = [];
	        
	        // Helper function to traverse the tree recursively
	        const traverseTree = (node: TreeNode<string>) => {
	            // Push the current node's data into the variations array
	            const variationEntry = {
	                name: node.data,
	                next: node.children.map(child => child.data),
	            };
	            variations.push(variationEntry);
	            
	            // Recursively traverse each child
	            node.children.forEach(child => traverseTree(child));
	        };

	        // Start the traversal from the root node
	        traverseTree(rootNode);

	        // Construct the JSON structure for this tree
	        return {
	            exercise: rootNode.data,
	            variations: variations
	        };
	    });

	    // Write the JSON data back to the file
	    fs.writeFileSync(this.dataPath, JSON.stringify(dataToSave, null, 2), 'utf8');
	}

	private convertDataToTree(dataPath: string) {
        this.variations = new Map()
    // Read and parse the JSON file
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const parsedData = JSON.parse(rawData);

    // Process each exercise from the parsed data
    parsedData.forEach((rawTree: any) => {
        // Create a new tree with the root exercise
        const tree = new Tree(rawTree.exercise); // Initialize Tree with the root exercise
        const nodeMap: Map<string, TreeNode<string>> = new Map(); // Map to track nodes by their names

        // Add the root node to the map
        nodeMap.set(tree.root.data, tree.root);

        // Build the tree using the variations data
        rawTree.variations.forEach((rawEdge: any) => {
            // Ensure the parent node exists in the map
            let parentNode = nodeMap.get(rawEdge.name);

            if (!parentNode) {
                console.error(`Parent node "${rawEdge.name}" not found in tree.`);
                return; // Skip this iteration if the parent is not found
            }

            // Create children nodes for the current variation
            rawEdge.next.forEach((childName: string) => {
                const childNode = new TreeNode(childName);
                childNode.parent = parentNode;
                parentNode.children.push(childNode);

                // Add the child node to the map for future reference
                nodeMap.set(childName, childNode);
            });
        });

        // Add the constructed tree to the Map using the root's data as the key
        this.variations.set(tree.root.data, tree);
    });
    this.printTrees()
}

}
