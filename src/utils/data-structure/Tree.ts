import { TreeNode } from './TreeNode';

// Tree class
export class Tree<T> {
    root: TreeNode<T>;

    // Constructor
    constructor(rootData: T) {
        this.root = new TreeNode(rootData);
        this.root.generateId()
    }

    // Find a node with given data
    findNode(data: T): TreeNode<T> | null {
        return this.root.findNode(data);
    }

    // Update the data of a node
    updateNodeData(currentData: T, newData: T): boolean {
        const node = this.findNode(currentData);
        if (node) {
            node.data = newData;
            return true;
        }
        return false;
    }

    addNode(data: T, parentNode: TreeNode<T>){
        const childNode = new TreeNode(data);
        childNode.parent = parentNode;
        parentNode.children.push(childNode);
        childNode.generateId()
        return childNode
    }

    // Delete a node with given data
    deleteNode(data: T) {
        const nodeToDelete = this.findNode(data);

        if (nodeToDelete && nodeToDelete.parent) {
            const parent = nodeToDelete.parent;
            const index = parent.children.indexOf(nodeToDelete);
            
            if (index !== -1) {
                // Replace the nodeToDelete with its children
                parent.children.splice(index, 1, ...nodeToDelete.children);

                // Update parent references for the deleted node's children
                for (const child of nodeToDelete.children) {
                    child.parent = parent;
                    child.generateId(); 
                }
                parent.generateId();
            }
        } else if (nodeToDelete === this.root) {
            console.error("Cannot delete the root node.");
        }
    }

    // Implementing the iterator to perform Breadth-First Search (BFS)
    *[Symbol.iterator](): Iterator<TreeNode<T>> {
        const queue: TreeNode<T>[] = [this.root]; // Start with the root node

        while (queue.length > 0) {
            const currentNode = queue.shift() as TreeNode<T>; // Get the first node in the queue

            yield currentNode; // Yield the current node

            // Add all children of the current node to the queue
            queue.push(...currentNode.children);
        }
    }
}
