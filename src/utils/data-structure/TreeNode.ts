export class TreeNode<T> {
  data: T;
  parent: TreeNode<T> | null; 
  children: TreeNode<T>[];
  id: string = ""; // parent.siblingIndex

  // Constructor
  constructor(data: T) {
      this.data = data;
      this.parent = null; 
      this.children = [];
  }

  generateId(){
    if(this.parent === null){
        this.id = "1.0";
    }else{
        const parentId = parseInt(this.parent.id.split(".")[0]) + 1
        const childIndex = this.parent.children.findIndex(node => node.data === this.data) + 1
        this.id = parentId + "." + childIndex
    }
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
