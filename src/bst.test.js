// ========================================================
// Test Binary Search Tree
// Author: Tim Cash
// Date: 2022-09-26
// ========================================================

import { BinarySearchTree, Operators, Node } from "./bst.js";
import { test, configure, skip } from "brittle";
configure({ timeout: 150, bail: true });

test("Node", (t) => {
  const node = new Node(1);
  t.is(node.key, 1);
  t.is(node.left.exists, false);
  t.is(node.right.exists, false);
});

test("Insert", (t) => {
  const bst = new BinarySearchTree();
  Operators.insert(bst, new Node(5));
  t.is(bst.root.key, 5, "root key");
  // CASE 1: new key is less than this key
  Operators.insert(bst, 1);
  t.is(bst.root.left.key, 1, "left key");
  // CASE 2: new key is greater or equal to this key
  Operators.insert(bst, 15);
  t.is(bst.root.right.key, 15, "right key");
  // Multiple inserts on same side
  Operators.insert(bst, 150);
  t.is(bst.root.right.right.key, 150, "right right key");
  // duplicate
  Operators.insert(bst, 15); 
  t.is(bst.root.right.right.left.key, 15, "duplicate");
  // negative
  Operators.insert(bst, -1);
  t.is(bst.root.left.left.key, -1, "negative key");

  // CASE Type Error
  try{
    Operators.insert(bst, "a")
  } catch (e) {
    t.is(e.message, "invalid key", "type error");
  }
});

test("Traverse", async (t) => {
  const bst = new BinarySearchTree();
  Operators.insert(bst, 5);
  Operators.insert(bst, 1);
  Operators.insert(bst, -1);
  Operators.insert(bst, 15);
  Operators.insert(bst, 15);
  const traversal = Operators.traverseInOrder(bst);
  t.alike(traversal, [-1, 1, 5, 15, 15], "sorted");
});

test("Load", (t) => {
  // const init = randomIntArray(10, -100, 100);
  const init = [
    -11,  87, 63, 85, 63,
     99, -97, 77,  0,  5
  ]
  const bst = new BinarySearchTree(init);
  const sorted = init.sort((a, b) => a - b);
  const traversal = Operators.traverseInOrder(bst);
  t.alike(traversal, sorted, "loaded from array");

  // CASE Type Error
  try  {
    const bst = new BinarySearchTree("a");
  } catch (e) {
    t.is(e.message, "invalid key", "type error");
  }
});

test("Find", (t) => {
  let bst = new BinarySearchTree([]);
  t.is(Operators.find(bst, 1), null, "empty tree");
  bst = new BinarySearchTree([5, 1, 15, 150]);
  const node = Operators.find(bst,15);
  t.is(node.key, 15);
  const noNode = Operators.find(bst, 14);
  t.is(noNode, null);

  // CASE Type Error
  try {
    Operators.find(bst, "1")
  } catch (e) {
    t.is(e.message, "invalid key", "type error");
  }
});

test("Min", async (t) => {
  const bst = new BinarySearchTree();
  let min = Operators.min(bst.root);
  t.is(min.exists, false, "empty tree");

  Operators.insert(bst, 5);
  min = Operators.min(bst.root);
  t.is(min.key, 5, "min key");

  Operators.insert(bst, 1);
  min = Operators.min(bst.root);
  t.is(min.key, 1, "min key");
});

test("Successor", async (t) => {
  /*           
            10 
           /   \         
          5     15 
        /   \     \              
      2       7      20      
    /  \     /  \    /  \
            6         
  */
  const init = [10, 5, 15, 2, 7, 20, 6];
  const bst = new BinarySearchTree(init);

  // CASE 0: - 1 No node found
  const noNode = Operators.successor(new Node());
  t.is(noNode, null, "no node found");

  // CASE 1: Node has right subtree
  // 5 R-> 7 L-> 6
  const rightSubTree = Operators.successor(bst.root.left);
  t.is(rightSubTree.key, 6, "right subtree");

  // CASE 2: Node has no right subtree & is left child
  // 2 ParentLeft -> 5
  const noRightSubTree = Operators.successor(bst.root.left.left);
  t.is(noRightSubTree.key, 5, "no right subtree left child");

  // CASE 2: Node has no right subtree & is right child
  // 7 -> 10
  const noRightSubTree2 = Operators.successor(bst.root.left.right);
  t.is(noRightSubTree2.key, 10, "no right subtree right child");

  // CASE 3: Node is largest and has no successor
  // 20 -> null
  const largest = Operators.successor(bst.root.right.right);
  t.is(largest.exists, false, "largest node");

  // Duplicate
  Operators.insert(bst, 6);
  const duplicate = Operators.successor(bst.root.left.right.left);
  t.is(duplicate.key, 6, "duplicate");

  // Duplicate greatest
  Operators.insert(bst, 20);
  const duplicateGreatest = Operators.successor(bst.root.right.right);
  t.is(duplicateGreatest.key, 20, "duplicate greatest");

  // CASE Type Error
  try {
    Operators.successor(bst.root, "1")
  } catch (error) {
    t.is(error.message, "invalid key", "type error");
  }
});

test("Remove", (t) => {
  /*           
            10 
           /   \         
          5      15 
        /   \      \              
      2       7      20      
    /  \     /  \    /  \
            6       19   25
  */
  const init = [10, 5, 15, 2, 7, 20, 6, 19, 25];
  let bst = new BinarySearchTree(init);

  // CASE 1: Node has no children
  let nodeToRemove = Operators.find(bst, 2);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.left.left.exists, false, "no children min");

  nodeToRemove = Operators.find(bst, 25);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.right.right.right.exists, false, "no children max");

  /*           
            10 
           /   \         
          5      15 
            \      \              
              7      20      
             /       / 
           6      19  
  */
  // CASE 2a: has left child only
  nodeToRemove = Operators.find(bst, 7);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.left.right.key, 6, "one child left");

  // CASE 2b: has right child only
  nodeToRemove = Operators.find(bst, 5);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.left.key, 6, "one child right");

  /*           
            10 
           /   \         
          5      15 
        /   \      \              
      2       7      20      
    /  \     /  \    /  \
            6       19   25
  */
  // CASE 3: has two children
  // CASE 3a: If successor is nodes immediate child,
  bst = new BinarySearchTree(init);
  nodeToRemove = Operators.find(bst, 20);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.right.right.key, 25, "two children successor is immediate child parent right");

  // CASE 3b: If successor is not nodes immediate child (min right)
  nodeToRemove = Operators.find(bst, 5);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.left.key, 6, "two children successor is not immediate child parent");

  // Remove root
  bst = new BinarySearchTree(init);
  nodeToRemove = Operators.find(bst, 10);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.key, 15, "remove root");

  nodeToRemove = Operators.find(bst, 15);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.key, 19, "remove root");

  nodeToRemove = Operators.find(bst, 19);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.key, 20, "remove root");

  nodeToRemove = Operators.find(bst, 20);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.key, 25, "remove root");

  nodeToRemove = Operators.find(bst, 25);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.key, 5, "root with only left");

  nodeToRemove = Operators.find(bst, 2);
  Operators.remove(bst, nodeToRemove);
  nodeToRemove = Operators.find(bst, 5);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.key, 7, "remove root only right");

  nodeToRemove = Operators.find(bst, 7);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.key, 6, "remove root only right");

  nodeToRemove = Operators.find(bst, 6);
  Operators.remove(bst, nodeToRemove);
  t.is(bst.root.exists, false, "remove root with no children");
});

test("Deepest", (t) => {
  let bst = new BinarySearchTree([12, 11, 90, 82, 7, 9]);
  let deepest = Operators.deepest(bst);
  t.alike(deepest, {keys:[9], depth:3}, "deepest node single");

  bst = new BinarySearchTree([26, 82, 16, 92, 33]);
  deepest = Operators.deepest(bst);
  t.alike(deepest, {keys:[33, 92], depth:2}, "deepest node double");

  bst = new BinarySearchTree([]);
  deepest = Operators.deepest(bst);
  t.alike(deepest, {keys:[], depth:0}, "deepest node");
});

test("Randomized", (t) => {
  for (let i = 0; i < 10; i++) {
    const init = randomIntArray(10, -100, 100);
    const bst = new BinarySearchTree(init);
    const expected = [...init].sort((a, b) => a - b);
    
    const targetValue = randomValue(expected, 1);
    const targetIndex = expected.findIndex((value) => value === targetValue);
    
    // Successor
    const nodeToFind = Operators.find(bst, targetValue);
    const successor = Operators.successor(nodeToFind);
    t.is(successor.key, expected[targetIndex + 1]);
    
    // Remove
    Operators.remove(bst, nodeToFind);
    // remove target value from sorted array for comparison
    expected.splice(targetIndex, 1);
    t.alike(Operators.traverseInOrder(bst), expected, "randomized remove");
  }
});

test("Mini Benchmark", (t) => {
  let bst = null;
  for(let i = 0; i < 7; i++) {
    const size = 10**i;
    const start = performance.now();
    const init = randomIntArray(size, -100000, 100000);
    bst = new BinarySearchTree(init);
    const end = performance.now();
    console.log(`Create BST ${size}: ${(end - start).toFixed(0)}ms`);
  }

  const findCount = 10000
  const start = performance.now();
  let found = 0;
  for(let i = 0; i < findCount; i++) {
    const node = Operators.find(bst, randomIntBetween(-100000, 100000));
    if (node?.exists) found++;
  }
  const end = performance.now();
  console.log(`${findCount} random Finds: @${(findCount/found).toFixed(2)}% found ${(end - start).toFixed(0)}ms`);
});

function randomIntArray(length, min, max) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(randomIntBetween(min, max));
  }
  return array;
}

function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomValue(array, chop = 0) {
  const min = 0;
  const max = array.length - 1 - chop;
  const index = Math.floor(Math.random() * (max - min + 1)) + min;
  return array[index];
}
