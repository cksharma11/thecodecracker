export const roadmap = [
  {
    stage: 1,
    title: "Basics & Arrays",
    difficulty: "Beginner",
    description: "Begin your DSA journey here. Master time & space complexity (Big O) and learn to manipulate continuous chunks of memory (Arrays & Hash maps).",
    concepts: [
      {
        id: "big-o",
        name: "Big O Notation",
        summary: "Understand how algorithm speed and memory grow as input size increases.",
        guide: `### What is Big O Notation?
Big O is a mathematical notation used to describe the limiting behavior of a function when the argument tends towards a particular value or infinity. In computer science, it describes the **worst-case time or space complexity** of an algorithm.

#### Common Complexities:
- **O(1) - Constant**: Execution time remains unchanged regardless of input size (e.g., hash map lookup, array index access).
- **O(log N) - Logarithmic**: Search space is halved at each step (e.g., Binary Search).
- **O(N) - Linear**: Run time grows proportionally to input size (e.g., scanning an array).
- **O(N log N) - Linearithmic**: Typical sorting speed (e.g., Merge Sort, Quick Sort).
- **O(N^2) - Quadratic**: Nested loops checking combinations (e.g., Bubble Sort, Brute force Two Sum).
- **O(2^N) - Exponential**: Recursion branching (e.g., naive Fibonacci, generating subsets).
- **O(N!) - Factorial**: Running all permutations (e.g., solving N-Queens).

#### Quick Complexity Reference Chart:
| Complexity | Operations for N = 100 | Operations for N = 10^5 |
| :--- | :--- | :--- |
| **O(1)** | 1 | 1 |
| **O(log N)** | ~7 | ~17 |
| **O(N)** | 100 | 100,000 |
| **O(N log N)** | ~700 | ~1.7 * 10^6 |
| **O(N^2)** | 10,000 | 10^10 (Will TLE/Crash!) |
| **O(2^N)** | 1.2 * 10^30 | Impossible |`,
        linkedProblems: [1, 2, 3]
      },
      {
        id: "arrays-hashmaps",
        name: "Arrays & Hash Maps",
        summary: "Store data linearly and retrieve values in constant time using keys.",
        guide: `### Arrays & Hash Maps Deep Dive

#### Arrays
An Array is a collection of elements stored in contiguous memory locations. Accessing an element by index takes **O(1)** time, but inserting or deleting at an arbitrary index takes **O(N)** because other elements must be shifted.

#### Hash Maps (Hash Tables)
A Hash Map maps keys to values using a hashing function. It allows for **amortized O(1)** insertions, deletions, and search lookups. It is the most powerful tool for solving DSA problems quickly.

#### Typical Patterns:
1. **Frequency Maps**: Count occurrences of characters or numbers to detect duplicates or anagrams.
2. **Complement Lookup**: Store the difference between a target value and current values to find matches in a single pass (e.g., Two Sum).
3. **Bucket Sorting**: Group elements by counts using arrays indexed by frequency counts.`,
        linkedProblems: [1, 2, 3, 4, 5, 6, 8]
      }
    ]
  },
  {
    stage: 2,
    title: "Linear Data Structures & Pointers",
    difficulty: "Intermediate",
    description: "Learn to navigate memory dynamically using pointers, sliding windows, and stacks.",
    concepts: [
      {
        id: "two-pointers",
        name: "Two Pointers Strategy",
        summary: "Use two active indices moving in coordination to optimize nested loop queries.",
        guide: `### Two Pointers Technique
Instead of using nested loops, which yield **O(N^2)** time, the two-pointers technique uses two index variables to scan the collection in **O(N)**.

#### Types of Configurations:
1. **Opposite Ends**: Pointers start at indices \`0\` and \`length - 1\` and move towards each other (e.g., Valid Palindrome, 3Sum, Container with Most Water).
2. **Slow / Fast Runners**: Both pointers start at the beginning, but one moves faster (e.g., Linked List Cycle detection).
3. **Sliding Windows**: Maintain left and right pointers forming a dynamic boundary containing elements of interest.`,
        linkedProblems: [11, 13, 14, 17, 18]
      },
      {
        id: "sliding-window",
        name: "Sliding Window",
        summary: "Scan sub-segments of arrays or strings dynamically without resizing bounds redundantly.",
        guide: `### Sliding Window
Sliding Window is an extension of Two Pointers. It tracks a subarray/substring defined by a start (left) and end (right) pointer.

#### Core Logic:
- Expand the window by advancing the right pointer to ingest new values.
- Check if the current window state violates constraints.
- If it does, shrink the window from the left until constraints are met.
- Track metrics (e.g., max window length, min substring length) dynamically.`,
        linkedProblems: [21, 22, 28]
      },
      {
        id: "stacks-queues",
        name: "Stacks & Queues",
        summary: "Solve problems using LIFO (Last In First Out) and FIFO (First In First Out) structures.",
        guide: `### Stacks & Queues

#### Stacks (LIFO - Last In First Out)
Elements are pushed and popped from the same end. Useful for:
- Matching nested tags (e.g., Valid Parentheses).
- Storing active evaluation parameters (e.g., Reverse Polish Notation).
- **Monotonic Stacks**: Stack elements are kept sorted (decreasing or increasing). Used to find the "next greater element" in **O(N)**.

#### Queues (FIFO - First In First Out)
Elements enter at the rear and exit from the front. Highly crucial for:
- Breadth-First Search (BFS) in trees and graphs.
- Task queues and buffer management.`,
        linkedProblems: [29, 32]
      }
    ]
  },
  {
    stage: 3,
    title: "Trees & Binary Search",
    difficulty: "Advanced",
    description: "Master logarithmic division of search spaces and hierarchical data structures (Trees, BST).",
    concepts: [
      {
        id: "binary-search",
        name: "Binary Search",
        summary: "Find values in sorted arrays in O(log N) time by halving search boundaries.",
        guide: `### Binary Search
Binary search works on **sorted** collections. It computes the midpoint, checks if target equals mid, and if not, halves search ranges recursively.

#### General Template:
\`\`\`javascript
let l = 0, r = nums.length - 1;
while (l <= r) {
    let m = Math.floor((l + r) / 2);
    if (nums[m] === target) return m;
    else if (nums[m] < target) l = m + 1;
    else r = m - 1;
}
return -1;
\`\`\`

#### Beyond Basic Search:
1. **Search Space Halving**: Find minimum elements in rotated sorted arrays.
2. **Binary Search on Answer**: Find boundaries of feasibility (e.g., Koko Eating Bananas).`,
        linkedProblems: [49, 52, 53]
      },
      {
        id: "trees-bst",
        name: "Binary Trees & BSTs",
        summary: "Navigate nodes containing child pointers recursively.",
        guide: `### Trees & BSTs
A Binary Tree consists of nodes, each having at most two children (left and right).

#### Binary Search Tree (BST)
A binary tree with sorting rules:
- Left subtree values are **strictly less** than the parent node.
- Right subtree values are **strictly greater** than the parent node.

#### Traversals:
1. **In-order (Left -> Root -> Right)**: Visits values in strictly sorted order for BSTs.
2. **Pre-order (Root -> Left -> Right)**: Useful for copying or serializing trees.
3. **Post-order (Left -> Right -> Root)**: Useful for bottom-up evaluations (e.g., calculating subtree depth).`,
        linkedProblems: [57, 58, 64, 66]
      }
    ]
  },
  {
    stage: 4,
    title: "Graphs & Dynamic Programming",
    difficulty: "Expert",
    description: "Solve interconnected node problems (Graphs) and optimize overlapping subproblems (Dynamic Programming).",
    concepts: [
      {
        id: "graphs",
        name: "Graphs Traversal (BFS & DFS)",
        summary: "Traverse grids and adjacency networks using queues and stacks.",
        guide: `### Graph Traversals
A Graph is a set of vertices (nodes) and edges connecting them. Unlike Trees, Graphs can contain cycles, requiring a \`visited\` set.

#### BFS (Breadth-First Search)
Uses a **Queue**. Visits neighbors level-by-level. Ideal for finding **shortest paths** in unweighted graphs.

#### DFS (Depth-First Search)
Uses **Recursion** (Stack). Explores branches fully before backtracking. Ideal for topological sorting, cycle detection, and connectivity checks (e.g. Number of Islands).`,
        linkedProblems: [83, 87]
      },
      {
        id: "dynamic-programming",
        name: "Dynamic Programming (DP)",
        summary: "Solve complex tasks by storing solutions to simpler subproblems.",
        guide: `### Dynamic Programming (DP)
DP is an optimization technique that speeds up recursive algorithms by storing intermediate results. It applies when problems exhibit:
1. **Overlapping Subproblems**: Same calculations are run repeatedly (e.g., Fibonacci).
2. **Optimal Substructure**: The global optimum can be built from sub-optimums.

#### Approaches:
- **Top-Down (Memoization)**: Keep recursion, but cache outputs in a hash map or array before returning.
- **Bottom-Up (Tabulation)**: Build a table iteratively from basic cases up to target values (e.g. Climbing Stairs, House Robber).`,
        linkedProblems: [93, 95]
      }
    ]
  }
];
