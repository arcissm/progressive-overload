export class TreeNode<T> {
  data: T;
  parent: TreeNode<T> | null; 
  children: TreeNode<T>[];

  // Constructor
  constructor(data: T) {
      this.data = data;
      this.parent = null; 
      this.children = [];
  }
  
  // Find a node by data (Recursive search)
  findNode(searchData: T): TreeNode<T> | null {
    if (this.data === searchData) {
        return this;
    }
    for (const child of this.children) {
        const result = child.findNode(searchData);
        if (result !== null) {
            return result;
        }
    }
    return null;
}

  // Override toString for better output
  toString(): string {
      return String(this.data);
  }
}
