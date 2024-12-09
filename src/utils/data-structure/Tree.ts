import { TreeNode } from './TreeNode';

export class Tree<T> {
    root: TreeNode<T>;

    constructor(rootData: T) {
        this.root = new TreeNode(rootData);
        this.root.generateId()
    }

    findNode(data: T): TreeNode<T> | null {
        return this.root.findNode(data);
    }

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

    deleteNode(data: T) {
        const nodeToDelete = this.findNode(data);

        if (nodeToDelete && nodeToDelete.parent) {
            const parent = nodeToDelete.parent;
            const index = parent.children.indexOf(nodeToDelete);
            
            if (index !== -1) {
                parent.children.splice(index, 1, ...nodeToDelete.children);

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
