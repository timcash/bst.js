// ========================================================
// Binary Search Tree
// Author: Tim Cash
// Date: 2022-09-26
// ========================================================

/**
 * Creates a new Node
 * Added "Empty" object to avoid null checks
 * and to make the interface more like literature
 * without the empty objects there where many conditionals
 * based on left vs right child checks
 * @class
 * @param {number} key
 * @param {Node} parent
 * @example new Node(1, new Node(2))
 */
class Node {
  constructor(key = null, parent = null) {
    if (key === null) {
      this.exists = false;
      return;
    }
    this.exists = true;
    this.key = key;
    this.left = new Node();
    this.right = new Node();
    this.parent = parent ?? new Node();
  }

  destroy() {
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

/**
 * Creates a new Binary Search Tree
 * essentially a container for the root node
 * and initilization of an array of numbers
 * @class
 * @param {number[]} startingValues
 */
class BinarySearchTree {
  constructor(startingValues = []) {
    this.root = new Node();
    for (const value of startingValues) {
      insert(this, value);
    }
  }
}

/**
 * A function to insert a new node into the tree
 * The complexity analysis of BST shows that,
 * Average case, insert, delete search takes:
 * O(log n) for n nodes
 * In the worst case they degrade to that of
 * a singly linked list:
 * O(n)
 * @function
 * @param {BinarySearchTree} T
 * @param {number} key
 */
function insert(T, input) {
  if (typeof input === "number") input = new Node(input);
  if (input.constructor.name !== "Node") throw new TypeError("invalid key");
  let node = new Node();
  let current = T.root;
  while (current.exists) {
    node = current;
    if (input.key < current.key) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  input.parent = node;
  if (input.parent.exists === false) {
    T.root = input;
  }
  if (input.key < node.key) {
    node.left = input;
  } else {
    node.right = input;
  }
}

/**
 * A function for traversing in accordance of the BST
 * other options are preorder and postorder
 * @function
 * @param {BinarySearchTree} T
 * @returns {number[]} - an array of the keys in acsending order
 */
function traverseInOrder(T) {
  const path = [];
  const traverse = (node) => {
    if (node.left.exists) traverse(node.left);
    path.push(node.key);
    if (node.right.exists) traverse(node.right);
  };
  traverse(T.root);
  return path;
}

/**
 * A helper function for finding deepeset nodes
 * @function
 * @param {Node} node
 * @returns {number} - the depth of the node
 */
function depth(node) {
  let current = node;
  let depth = 0;
  while (current.parent.exists) {
    current = current.parent;
    depth++;
  }
  return depth;
}

/**
 * @typedef {Object} DepthData
 * @property {number} depth - the depth of the nodes
 * @property {number[]} keys - the keys of the nodes
 */

/**
 * A function for finding a list of deepeset nodes
 * all at the same depth
 * @function
 * @param {BinarySearchTree} T
 * @returns {DepthData} - an object with the depth and keys
 */
function deepest(T) {
  // get all nodes on the deepest level
  let nodes = [];
  let deepestNode = 0;
  const traverse = (node) => {
    if (node.exists === false) return;
    if (node.left.exists) traverse(node.left);
    if (node.right.exists) traverse(node.right);
    if (node.left.exists === false && node.right.exists === false) {
      const nodeDepth = depth(node);
      if (nodeDepth === deepestNode) {
        nodes.push(node);
      } else if (nodeDepth > deepestNode) {
        deepestNode = nodeDepth;
        nodes = [node];
      }
    }
  };
  traverse(T.root);
  return { keys: nodes.map((node) => node.key), depth: deepestNode };
}

/**
 * A function for iterating to find a node
 * @function
 * @param {BinarySearchTree} T
 * @param {number} key
 */
function find(T, key) {
  if (typeof key !== "number") throw new Error("invalid key");
  if (T.root.exists === false) return null;
  let current = T.root;
  while (current.exists) {
    if (key === current.key) return current;
    if (key < current.key) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  return null;
}

/**
 * A function for finding the minimum node
 * from a given starting node
 * @function
 * @param {Node} node
 * @returns {Node} - the minimum node
 */
function min(node) {
  let current = node;
  while (current.left?.exists) {
    current = current.left;
  }
  return current;
}

/**
 * A function for finding the next largest node
 * handy for deleting nodes
 * @param {Node} node
 * @returns {Node} - the next largest node
 * @example
 * const tree = new BinarySearchTree([0,-1,-10,4,5]);
 * const node = find(tree, 4);
 * const next = successor(node);
 * console.log(next.key); // 5
 */
function successor(node) {
  if (node.exists === false) return null;
  if (node.right.exists) return min(node.right);
  let successor = node.parent;
  while (successor.exists && node === successor.right) {
    node = successor;
    successor = successor.parent;
  }
  return successor;
}

/**
 * A function is for shifting pointers
 * keeping the name and parameters
 * as literature for easy reference
 * @function
 * @param {BinarySearchTree} T
 * @param {Node} u - node to be removed
 * @param {Node} v - the node to replace u
 */
function shiftNodes(T, u, v) {
  if (u.parent.exists === false) {
    T.root = v;
  } else if (u === u.parent.left) {
    u.parent.left = v;
  } else {
    u.parent.right = v;
  }
  v.parent = u.parent;
}

/**
 * A function for deleting a node from the tree
 * cleans up the tree by shifting pointers
 * destroys the node after it is removed
 *
 * @function
 * @param {BinarySearchTree} T
 * @param {Node} node
 * @example
 * const tree = new BinarySearchTree([1,2,3,4,5,6,7,8,9]);
 * const node = find(tree, 5);
 * remove(tree, node);
 */
function remove(T, node) {
  if (node.left.exists === false) {
    shiftNodes(T, node, node.right);
  } else if (node.right.exists === false) {
    shiftNodes(T, node, node.left);
  } else {
    const succ = successor(node);
    if (succ.parent !== node) {
      shiftNodes(T, succ, succ.right);
      succ.right = node.right;
      succ.right.parent = succ;
    }
    shiftNodes(T, node, succ);
    succ.left = node.left;
    succ.left.parent = succ;
  }

  node.destroy();
}

const Operators = {
  min,
  find,
  insert,
  traverseInOrder,
  successor,
  remove,
  deepest,
};

export { BinarySearchTree, Operators, Node };
