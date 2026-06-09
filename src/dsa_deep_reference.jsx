
import { useState } from "react";

const MODULES = [
  {
    id: "M01", name: "Arrays & Strings", color: "#3B6FE8",
    drills: [
      "Traverse an array and print all elements (forward + backward)",
      "Find the maximum and minimum element in an unsorted array",
      "Reverse an array in-place without extra space",
      "Rotate array left/right by K positions",
      "Move all zeroes to the end without changing relative order",
      "Find duplicates in an array using hashing",
      "Sliding window: max sum subarray of size K",
      "Two pointer: pair with given sum in sorted array",
      "Prefix sum: range sum queries on static array",
      "Kadane's algorithm: max subarray sum"
    ],
    bestPractices: [
      "Always check for empty array / null input before any operation",
      "Prefer two-pointer over nested loops for O(n) gains on sorted arrays",
      "Use prefix sums when multiple range queries are needed",
      "Sliding window pattern replaces O(n²) brute-force for subarray problems",
      "Avoid creating unnecessary copies — modify in-place when possible",
      "For sorted arrays, always think binary search before linear scan",
      "Handle edge cases: single element, all same elements, negative numbers",
      "String problems: consider character frequency maps (array of size 26 for lowercase)"
    ],
    problems: [
      { title: "Two Sum", link: "https://leetcode.com/problems/two-sum/", level: "Easy" },
      { title: "Best Time to Buy and Sell Stock", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", level: "Easy" },
      { title: "Maximum Subarray (Kadane's)", link: "https://leetcode.com/problems/maximum-subarray/", level: "Medium" },
      { title: "Product of Array Except Self", link: "https://leetcode.com/problems/product-of-array-except-self/", level: "Medium" },
      { title: "Container With Most Water", link: "https://leetcode.com/problems/container-with-most-water/", level: "Medium" },
      { title: "Longest Substring Without Repeating", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", level: "Medium" },
      { title: "3Sum", link: "https://leetcode.com/problems/3sum/", level: "Medium" },
      { title: "Trapping Rain Water", link: "https://leetcode.com/problems/trapping-rain-water/", level: "Hard" }
    ],
    qa: [
      { q: "What is the time complexity of accessing an element by index vs searching by value?", a: "Index access is O(1) — arrays store elements in contiguous memory, so the address is calculated as base + index × size. Searching by value is O(n) for unsorted arrays (linear scan) and O(log n) for sorted arrays (binary search)." },
      { q: "When should you use a sliding window vs two pointers?", a: "Use sliding window for contiguous subarray/substring problems with a constraint (max sum of K elements, longest substring with K distinct chars). Use two pointers when you have a sorted array and need pairs/triplets, or when shrinking from both ends (palindrome check, container with most water)." },
      { q: "Why does Kadane's algorithm work?", a: "At each index, you make a greedy choice: either extend the previous subarray (prev_max + current) or start fresh (current). You never carry a negative sum forward because that would only hurt future subarrays. The global max tracks the best answer seen." },
      { q: "What is a prefix sum array and when is it useful?", a: "A prefix sum array stores cumulative sums: prefix[i] = arr[0]+...+arr[i]. Range sum from L to R = prefix[R] - prefix[L-1], computed in O(1) after O(n) preprocessing. Ideal when you have many range sum queries on a static array." },
      { q: "How do you detect if two strings are anagrams?", a: "Sort both strings and compare — O(n log n). Or use a frequency map: increment for string1, decrement for string2, check all zeros — O(n). The frequency map approach is better for large strings." }
    ]
  },
  {
    id: "M02", name: "Linked Lists", color: "#7C3AED",
    drills: [
      "Insert a node at head, tail, and middle of a singly linked list",
      "Delete a node given its value",
      "Traverse and print all nodes",
      "Find length of linked list (iterative + recursive)",
      "Reverse a singly linked list in-place",
      "Detect a cycle using Floyd's slow-fast pointer",
      "Find the middle node using slow-fast pointer",
      "Merge two sorted linked lists",
      "Remove Nth node from end in one pass",
      "Check if linked list is a palindrome"
    ],
    bestPractices: [
      "Always handle null/empty list as first check in any operation",
      "Use a dummy head node to simplify insertions at the beginning",
      "Floyd's cycle detection: fast pointer moves 2x, slow 1x — O(1) space",
      "For 'kth from end' problems, use two pointers K nodes apart",
      "Never lose your next pointer reference before updating it during reversal",
      "Doubly linked lists trade O(1) backward traversal for 2x memory per node",
      "Prefer iterative solutions over recursive for very long lists (stack overflow risk)",
      "When merging/sorting, think about pointer reassignment rather than data swapping"
    ],
    problems: [
      { title: "Reverse Linked List", link: "https://leetcode.com/problems/reverse-linked-list/", level: "Easy" },
      { title: "Merge Two Sorted Lists", link: "https://leetcode.com/problems/merge-two-sorted-lists/", level: "Easy" },
      { title: "Linked List Cycle", link: "https://leetcode.com/problems/linked-list-cycle/", level: "Easy" },
      { title: "Middle of the Linked List", link: "https://leetcode.com/problems/middle-of-the-linked-list/", level: "Easy" },
      { title: "Remove Nth Node From End", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", level: "Medium" },
      { title: "Add Two Numbers", link: "https://leetcode.com/problems/add-two-numbers/", level: "Medium" },
      { title: "Reorder List", link: "https://leetcode.com/problems/reorder-list/", level: "Medium" },
      { title: "Merge K Sorted Lists", link: "https://leetcode.com/problems/merge-k-sorted-lists/", level: "Hard" }
    ],
    qa: [
      { q: "How does Floyd's cycle detection algorithm work?", a: "Two pointers start at head. Slow moves 1 step, fast moves 2 steps each iteration. If a cycle exists, fast will lap slow and they'll meet inside the cycle. If no cycle, fast reaches null. Time O(n), space O(1) — no hash set needed." },
      { q: "Why use a dummy head node?", a: "A dummy (sentinel) head node eliminates special-casing the head during insertions and deletions. Without it, deleting the first node needs separate logic. With dummy, every node including head has a predecessor, so the same code handles all positions." },
      { q: "What's the difference between singly and doubly linked lists for deletion?", a: "Singly linked: to delete node X, you need X's predecessor because you must update prev.next. So deletion is O(n) unless you have the predecessor. Doubly linked: each node has prev and next pointers, so deletion of a given node is O(1) — no traversal needed." },
      { q: "How do you find the starting point of a cycle?", a: "After Floyd's detection finds the meeting point, reset one pointer to head. Move both pointers one step at a time. They meet exactly at the cycle's start. This works due to a mathematical property: the distance from head to cycle start equals the distance from meeting point to cycle start." },
      { q: "When would you choose a linked list over an array?", a: "When insertions/deletions at arbitrary positions are frequent — O(1) with a pointer vs O(n) shifting in arrays. When size is unknown or highly variable. Drawback: O(n) random access (no index lookup), poor cache locality compared to arrays." }
    ]
  },
  {
    id: "M03", name: "Stacks & Queues", color: "#059669",
    drills: [
      "Implement a stack using an array",
      "Implement a queue using two stacks",
      "Implement a stack that supports getMin() in O(1)",
      "Check for balanced parentheses using a stack",
      "Evaluate a postfix (RPN) expression",
      "Next Greater Element for every array position",
      "Implement a circular queue",
      "Implement a deque (double-ended queue)",
      "Stock span problem using a stack",
      "Largest rectangle in histogram"
    ],
    bestPractices: [
      "Stack for: matching brackets, undo-redo, DFS traversal, expression evaluation",
      "Queue for: BFS traversal, task scheduling, first-come-first-served processing",
      "Monotonic stack: maintain increasing or decreasing order for NGE-type problems",
      "Always check isEmpty() before pop/peek to avoid underflow errors",
      "Min stack trick: push pair (value, current_min) to track minimum in O(1)",
      "Queue with two stacks: push to stack1, pop from stack2 (refill when empty) — amortized O(1)",
      "For sliding window maximum problems, deque is more efficient than priority queue",
      "Think of stacks when problem involves 'most recent' and queues for 'oldest first'"
    ],
    problems: [
      { title: "Valid Parentheses", link: "https://leetcode.com/problems/valid-parentheses/", level: "Easy" },
      { title: "Min Stack", link: "https://leetcode.com/problems/min-stack/", level: "Medium" },
      { title: "Evaluate Reverse Polish Notation", link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", level: "Medium" },
      { title: "Daily Temperatures", link: "https://leetcode.com/problems/daily-temperatures/", level: "Medium" },
      { title: "Next Greater Element I", link: "https://leetcode.com/problems/next-greater-element-i/", level: "Easy" },
      { title: "Implement Queue using Stacks", link: "https://leetcode.com/problems/implement-queue-using-stacks/", level: "Easy" },
      { title: "Sliding Window Maximum", link: "https://leetcode.com/problems/sliding-window-maximum/", level: "Hard" },
      { title: "Largest Rectangle in Histogram", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/", level: "Hard" }
    ],
    qa: [
      { q: "What is a monotonic stack and when do you use it?", a: "A monotonic stack maintains elements in strictly increasing or decreasing order. When you push a new element, you pop everything that violates the order. It solves 'Next Greater/Smaller Element', 'Stock Span', and 'Histogram Rectangle' problems in O(n) instead of O(n²) brute force." },
      { q: "How does implementing a queue with two stacks achieve amortized O(1)?", a: "Stack1 handles all pushes. Stack2 handles all pops. When stack2 is empty and a pop is needed, dump all of stack1 into stack2 (reversing order). Each element moves from stack1 to stack2 at most once, so across N operations, total work is O(N) — amortized O(1) per operation." },
      { q: "What is the difference between a stack and a call stack?", a: "A stack is a general data structure (LIFO). The call stack is the runtime's specific use of stack memory to track function calls — each function call pushes a frame (local variables, return address), and returning pops it. Recursive functions consume call stack space, which is why deep recursion can cause stack overflow." },
      { q: "When would you use a deque over a queue?", a: "Use a deque when you need O(1) insertion/deletion from both ends. Classic use: sliding window maximum (add new element to back, remove expired elements from front), palindrome checking, and implementing both stack and queue behavior with one structure." },
      { q: "Explain the stock span problem and how a stack solves it.", a: "Stock span = number of consecutive days before today where price was ≤ today's price. Brute force is O(n²). With a stack: maintain a stack of indices of days with greater prices. For each day, pop everything ≤ current price. The span is (current index - top of stack). Each element is pushed and popped at most once → O(n)." }
    ]
  },
  {
    id: "M04", name: "Trees: Binary & BST", color: "#DC2626",
    drills: [
      "Insert a node into a BST",
      "Search for a value in a BST",
      "Inorder traversal (iterative + recursive)",
      "Preorder and Postorder traversal",
      "Level-order traversal (BFS on tree)",
      "Find height of a binary tree",
      "Find diameter of a binary tree",
      "Check if a binary tree is balanced",
      "Find Lowest Common Ancestor in BST",
      "Convert sorted array to balanced BST"
    ],
    bestPractices: [
      "Always handle null root as the base case in recursive functions",
      "Inorder of BST gives sorted sequence — use this property for validation",
      "Height-balanced check: at every node, |leftHeight - rightHeight| ≤ 1",
      "Level-order traversal uses a queue, all DFS traversals can use stack or recursion",
      "For LCA in BST: if both nodes < root, go left; if both > root, go right; else root is LCA",
      "Diameter passes through a node = leftHeight + rightHeight at that node",
      "Prefer iterative inorder for interview: uses explicit stack, avoids recursion limit",
      "When building BST from sorted array, always pick the middle element as root"
    ],
    problems: [
      { title: "Maximum Depth of Binary Tree", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", level: "Easy" },
      { title: "Invert Binary Tree", link: "https://leetcode.com/problems/invert-binary-tree/", level: "Easy" },
      { title: "Symmetric Tree", link: "https://leetcode.com/problems/symmetric-tree/", level: "Easy" },
      { title: "Binary Tree Level Order Traversal", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/", level: "Medium" },
      { title: "Validate Binary Search Tree", link: "https://leetcode.com/problems/validate-binary-search-tree/", level: "Medium" },
      { title: "Lowest Common Ancestor of BST", link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", level: "Medium" },
      { title: "Binary Tree Maximum Path Sum", link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", level: "Hard" },
      { title: "Serialize and Deserialize Binary Tree", link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", level: "Hard" }
    ],
    qa: [
      { q: "What is the time complexity of BST operations and when does it degrade?", a: "Average case: O(log n) for search, insert, delete — proportional to tree height. Worst case: O(n) when the tree degrades to a linked list (inserting sorted data into a plain BST). Self-balancing trees (AVL, Red-Black) maintain O(log n) worst case by restructuring on insert/delete." },
      { q: "What are the three DFS traversals and their use cases?", a: "Inorder (Left→Root→Right): gives sorted output for BST. Preorder (Root→Left→Right): used to clone/serialize a tree; root is always processed first. Postorder (Left→Right→Root): used to delete a tree or evaluate expression trees; children are always processed before parent." },
      { q: "How do you check if a binary tree is a valid BST?", a: "The naive approach of checking left < root < right at each node is wrong — it doesn't account for values from ancestors. Correct approach: pass min/max bounds down the recursion. Each node must satisfy min < node.value < max. Start with (-∞, +∞) at root; going left updates max, going right updates min." },
      { q: "What is the difference between tree height and tree depth?", a: "Depth of a node = number of edges from root to that node. Root has depth 0. Height of a node = number of edges on the longest path from that node to a leaf. Height of tree = height of root. A leaf has height 0. These are often confused: height is measured upward, depth downward." },
      { q: "How does level-order traversal work and what is it useful for?", a: "Use a queue. Enqueue root. While queue is not empty: dequeue node, process it, enqueue its left and right children. This visits nodes level by level (BFS). Useful for: level-by-level display, finding minimum depth, right side view of tree, connecting nodes at same level." }
    ]
  },
  {
    id: "M05", name: "Heaps & Priority Queues", color: "#D97706",
    drills: [
      "Build a min-heap from an unsorted array (heapify)",
      "Insert an element into a max-heap and bubble up",
      "Extract the minimum from a min-heap and bubble down",
      "Implement heap sort",
      "Find the Kth largest element using a min-heap",
      "Find top K frequent elements",
      "Merge K sorted arrays using a min-heap",
      "Find median from a data stream using two heaps",
      "Task scheduler problem using a max-heap",
      "K closest points to origin"
    ],
    bestPractices: [
      "Min-heap: parent ≤ children. Max-heap: parent ≥ children. Parent of i = (i-1)/2, children = 2i+1 and 2i+2 (0-indexed)",
      "Build heap in O(n) using bottom-up heapify — NOT by inserting one-by-one (that's O(n log n))",
      "For 'Kth largest', use a min-heap of size K — smaller heap = faster operations",
      "For 'Kth smallest', use a max-heap of size K",
      "Two-heap pattern for median: max-heap for lower half, min-heap for upper half",
      "Heap sort is O(n log n) and in-place but not stable — prefer merge sort when stability matters",
      "Priority queue in Java/Python is min-heap by default; negate values for max-heap behavior",
      "Always rebalance (sift-up or sift-down) after every insert or delete"
    ],
    problems: [
      { title: "Kth Largest Element in Array", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/", level: "Medium" },
      { title: "Top K Frequent Elements", link: "https://leetcode.com/problems/top-k-frequent-elements/", level: "Medium" },
      { title: "Find Median from Data Stream", link: "https://leetcode.com/problems/find-median-from-data-stream/", level: "Hard" },
      { title: "K Closest Points to Origin", link: "https://leetcode.com/problems/k-closest-points-to-origin/", level: "Medium" },
      { title: "Merge K Sorted Lists", link: "https://leetcode.com/problems/merge-k-sorted-lists/", level: "Hard" },
      { title: "Task Scheduler", link: "https://leetcode.com/problems/task-scheduler/", level: "Medium" },
      { title: "Ugly Number II", link: "https://leetcode.com/problems/ugly-number-ii/", level: "Medium" },
      { title: "Reorganize String", link: "https://leetcode.com/problems/reorganize-string/", level: "Medium" }
    ],
    qa: [
      { q: "Why is building a heap O(n) and not O(n log n)?", a: "When building bottom-up, we call heapify only on internal nodes (n/2 of them). Nodes near the bottom do very little work (small subtrees). Mathematically, summing height × count across all levels converges to O(n). Inserting elements one-by-one would be O(n log n) because each insert is O(log n)." },
      { q: "Explain the two-heap pattern for finding a running median.", a: "Maintain a max-heap (lower half of numbers) and a min-heap (upper half). After each insert: balance so they differ in size by at most 1. The median is either the top of the larger heap or the average of both tops. Each insert is O(log n), each median query is O(1)." },
      { q: "When would you use a heap vs a sorted array for a priority queue?", a: "Heap: O(log n) insert, O(log n) delete-min, O(1) peek-min. Sorted array: O(n) insert (to maintain order), O(1) delete-min. Use heap when you have frequent inserts and deletes. Use sorted array when insertions are rare but you need fast range access or multiple operations beyond min/max." },
      { q: "What is heap sort and why is it not used in practice despite O(n log n)?", a: "Heap sort: build max-heap O(n), then repeatedly extract max and place at end O(n log n). It's in-place and O(n log n) worst case. But it's not cache-friendly (jumps around memory), not stable, and in practice slower than quicksort due to poor locality. Used when worst-case guarantee matters more than average-case speed." },
      { q: "How do you find the Kth largest element efficiently?", a: "Maintain a min-heap of size K. Iterate through the array: push element, and if heap size exceeds K, pop the minimum. At the end, the heap top is the Kth largest. Time O(n log K), space O(K). Better than full sort O(n log n) when K << n." }
    ]
  },
  {
    id: "M06", name: "Hashing", color: "#0891B2",
    drills: [
      "Implement a hash map from scratch using chaining",
      "Find first non-repeating character in a string",
      "Check if two strings are anagrams using a frequency map",
      "Group anagrams together from a list of strings",
      "Find subarray with given sum using prefix sum + hash map",
      "Find longest consecutive sequence in unsorted array",
      "Two sum using a hash map",
      "Count distinct elements in every window of size K",
      "Check if array contains duplicate within K distance",
      "Find all pairs with a given difference"
    ],
    bestPractices: [
      "HashMap gives average O(1) insert/search/delete — worst case O(n) with hash collisions",
      "Choose a good hash function: uniform distribution minimises collisions",
      "Load factor > 0.7 triggers rehashing — doubles the table and re-inserts all elements",
      "Chaining (linked list per bucket) vs open addressing (probe for empty slot) — chaining simpler, open addressing better cache",
      "For problems needing 'seen before', HashSet; for 'count of', HashMap",
      "Complement pattern: for two-sum, store target-element, check if current element exists in map",
      "Prefix sum + HashMap: O(n) solution for 'subarray with sum K' problems",
      "For string keys, sorted key = anagram signature (group anagrams in O(n·k log k))"
    ],
    problems: [
      { title: "Two Sum", link: "https://leetcode.com/problems/two-sum/", level: "Easy" },
      { title: "Group Anagrams", link: "https://leetcode.com/problems/group-anagrams/", level: "Medium" },
      { title: "Longest Consecutive Sequence", link: "https://leetcode.com/problems/longest-consecutive-sequence/", level: "Medium" },
      { title: "Subarray Sum Equals K", link: "https://leetcode.com/problems/subarray-sum-equals-k/", level: "Medium" },
      { title: "Contains Duplicate II", link: "https://leetcode.com/problems/contains-duplicate-ii/", level: "Easy" },
      { title: "Valid Anagram", link: "https://leetcode.com/problems/valid-anagram/", level: "Easy" },
      { title: "LRU Cache", link: "https://leetcode.com/problems/lru-cache/", level: "Medium" },
      { title: "Find All Anagrams in a String", link: "https://leetcode.com/problems/find-all-anagrams-in-a-string/", level: "Medium" }
    ],
    qa: [
      { q: "What makes a good hash function?", a: "Deterministic (same input → same hash), uniform distribution (minimise clustering), fast to compute, and avalanche effect (small input change → large hash change). A poor hash function causes many collisions, degrading HashMap to a linked list with O(n) operations." },
      { q: "How does HashMap handle collisions in Java/Python?", a: "Java's HashMap uses chaining (linked list per bucket). Since Java 8, when a bucket has ≥ 8 entries, it converts to a Red-Black tree → O(log n) worst case instead of O(n). Python's dict uses open addressing with random probing. Both resize (rehash) when load factor crosses a threshold." },
      { q: "Explain the LRU Cache design.", a: "Use a doubly linked list (to track access order, O(1) move-to-front) and a HashMap (key → node pointer, O(1) lookup). On get: find node in O(1), move to front. On put: add to front; if over capacity, remove from tail. Both operations O(1). This is a very common design interview problem." },
      { q: "How does prefix sum with HashMap solve 'subarray sum equals K'?", a: "Track running prefix sum as you iterate. Store how many times each prefix sum has been seen. At each index, check if (current_prefix_sum - K) exists in the map — if yes, subarrays ending here with sum K = map[current_sum - K]. This gives O(n) vs O(n²) brute force." },
      { q: "What is the difference between HashMap, HashSet, LinkedHashMap, and TreeMap?", a: "HashMap: key-value, O(1) avg, unordered. HashSet: unique keys only, O(1) avg. LinkedHashMap: HashMap + insertion order preserved (doubly linked list through entries). TreeMap: sorted by key, O(log n) — backed by Red-Black tree. Use TreeMap when you need sorted iteration or range queries." }
    ]
  },
  {
    id: "M07", name: "Graphs: BFS & DFS", color: "#BE185D",
    drills: [
      "Build a graph as adjacency list from edge list",
      "BFS traversal from a source node",
      "DFS traversal (iterative + recursive)",
      "Detect cycle in undirected graph (BFS/DFS)",
      "Detect cycle in directed graph (DFS with color marking)",
      "Topological sort (DFS + Kahn's BFS algorithm)",
      "Find shortest path in unweighted graph (BFS)",
      "Count connected components",
      "Check if graph is bipartite",
      "Find all paths from source to destination"
    ],
    bestPractices: [
      "Always maintain a visited set/array to avoid infinite loops in cyclic graphs",
      "BFS guarantees shortest path in unweighted graphs — DFS does not",
      "Adjacency list is more space-efficient for sparse graphs; matrix for dense graphs",
      "For cycle in directed graph, use 3-color DFS: white (unvisited), grey (in stack), black (done)",
      "Topological sort only works on DAGs (Directed Acyclic Graphs)",
      "Kahn's algorithm (BFS-based topo sort): track in-degrees, start from nodes with 0 in-degree",
      "For grid problems, treat each cell as a node — 4 or 8 directional neighbors",
      "DFS for: cycle detection, topological sort, connected components, path finding"
    ],
    problems: [
      { title: "Number of Islands", link: "https://leetcode.com/problems/number-of-islands/", level: "Medium" },
      { title: "Clone Graph", link: "https://leetcode.com/problems/clone-graph/", level: "Medium" },
      { title: "Course Schedule", link: "https://leetcode.com/problems/course-schedule/", level: "Medium" },
      { title: "Course Schedule II", link: "https://leetcode.com/problems/course-schedule-ii/", level: "Medium" },
      { title: "Word Ladder", link: "https://leetcode.com/problems/word-ladder/", level: "Hard" },
      { title: "Pacific Atlantic Water Flow", link: "https://leetcode.com/problems/pacific-atlantic-water-flow/", level: "Medium" },
      { title: "Graph Valid Tree", link: "https://leetcode.com/problems/graph-valid-tree/", level: "Medium" },
      { title: "Alien Dictionary", link: "https://leetcode.com/problems/alien-dictionary/", level: "Hard" }
    ],
    qa: [
      { q: "When should you use BFS vs DFS for graph traversal?", a: "BFS: when you need shortest path in an unweighted graph, level-by-level traversal, or when the solution is likely close to the source. DFS: when exploring all paths, detecting cycles, topological sorting, or when the graph is deep and the solution is far from source. DFS uses less memory for wide graphs; BFS uses less for deep graphs." },
      { q: "How do you detect a cycle in a directed graph?", a: "Use DFS with three states per node: WHITE (unvisited), GREY (currently in recursion stack), BLACK (fully processed). If you encounter a GREY node, you've found a back edge → cycle exists. GREY means we're revisiting a node that's still in the current path, which is the definition of a cycle." },
      { q: "What is topological sort and when is it valid?", a: "Topological sort is a linear ordering of vertices where for every directed edge u→v, u appears before v. It's only possible for DAGs (no cycles). Used for task scheduling, build systems, course prerequisites. Two approaches: DFS (add to result on exit) or Kahn's BFS (process 0-indegree nodes, decrement neighbors' in-degrees)." },
      { q: "How does BFS find the shortest path in an unweighted graph?", a: "BFS explores nodes level by level — first all nodes at distance 1, then distance 2, etc. The first time you reach the destination, that's guaranteed to be the shortest path because no path of fewer edges has been missed. Store distance (or parent) for each visited node to reconstruct the path." },
      { q: "What is the time and space complexity of BFS and DFS?", a: "Both are O(V + E) time (V vertices, E edges) — each vertex and edge is processed once. Space: BFS uses O(V) for the queue (width of graph at widest level). DFS uses O(V) for the call stack (depth of graph). In the worst case (complete graph or deep tree), both are O(V)." }
    ]
  },
  {
    id: "M08", name: "Dynamic Programming", color: "#7C3AED",
    drills: [
      "Fibonacci number (memoization + tabulation)",
      "0/1 Knapsack problem",
      "Longest Common Subsequence (LCS)",
      "Longest Increasing Subsequence (LIS)",
      "Coin change: minimum coins for a target",
      "Coin change II: number of ways to make change",
      "Climbing stairs (1 or 2 steps)",
      "Grid DP: minimum path sum in a matrix",
      "Edit distance between two strings",
      "Partition equal subset sum"
    ],
    bestPractices: [
      "Identify: overlapping subproblems + optimal substructure = DP candidate",
      "Top-down (memoization): write recursive solution first, then cache results",
      "Bottom-up (tabulation): define state, set base cases, fill table in correct order",
      "State definition is the hardest part — make it precise and complete",
      "Space optimization: if dp[i] only depends on dp[i-1], use two variables instead of array",
      "For string DP, dp[i][j] usually refers to first i chars of string1, first j of string2",
      "Draw the recurrence relation before coding — it's your blueprint",
      "Recognize patterns: knapsack, LCS, LIS, shortest path, interval DP, digit DP"
    ],
    problems: [
      { title: "Climbing Stairs", link: "https://leetcode.com/problems/climbing-stairs/", level: "Easy" },
      { title: "House Robber", link: "https://leetcode.com/problems/house-robber/", level: "Medium" },
      { title: "Coin Change", link: "https://leetcode.com/problems/coin-change/", level: "Medium" },
      { title: "Longest Common Subsequence", link: "https://leetcode.com/problems/longest-common-subsequence/", level: "Medium" },
      { title: "Word Break", link: "https://leetcode.com/problems/word-break/", level: "Medium" },
      { title: "Partition Equal Subset Sum", link: "https://leetcode.com/problems/partition-equal-subset-sum/", level: "Medium" },
      { title: "Edit Distance", link: "https://leetcode.com/problems/edit-distance/", level: "Hard" },
      { title: "Burst Balloons", link: "https://leetcode.com/problems/burst-balloons/", level: "Hard" }
    ],
    qa: [
      { q: "How do you know if a problem should be solved with DP?", a: "Two signals: (1) Overlapping subproblems — the same smaller problems are solved repeatedly (e.g., Fibonacci). (2) Optimal substructure — the optimal solution of the whole problem can be constructed from optimal solutions of subproblems. If you find yourself recursing with the same arguments repeatedly, that's a DP signal." },
      { q: "What is the difference between memoization and tabulation?", a: "Memoization (top-down): start with the original problem, recurse into subproblems, cache results. Code looks like recursion with a hashmap/array. Lazy — only computes what's needed. Tabulation (bottom-up): fill a table iteratively from smallest subproblems up. No recursion overhead. Often more space-optimizable. Same time complexity, tabulation usually faster in practice." },
      { q: "Explain the 0/1 Knapsack recurrence.", a: "dp[i][w] = max value using first i items with capacity w. For each item i: if item weight > w, skip it: dp[i][w] = dp[i-1][w]. Otherwise, choose max of (skip: dp[i-1][w]) or (take: dp[i-1][w-weight[i]] + value[i]). The '0/1' means each item is used at most once — if unlimited use, it's the unbounded knapsack." },
      { q: "How does LCS differ from LIS?", a: "LCS (Longest Common Subsequence): longest sequence present in both strings, not necessarily contiguous. 2D DP, O(mn). LIS (Longest Increasing Subsequence): longest subsequence in one array where each element is strictly greater than the previous. 1D DP, O(n²) naive, O(n log n) with patience sorting." },
      { q: "What is the space optimisation trick for grid DP?", a: "For problems where dp[i][j] only depends on dp[i-1][j] and dp[i][j-1] (like min path sum), you only need the previous row, not the entire 2D table. Use a 1D array and update it in-place left-to-right. Reduces space from O(mn) to O(n). If dp[i][j] only depends on dp[i][j-1], just use two variables." }
    ]
  },
  {
    id: "M09", name: "Sorting Algorithms", color: "#047857",
    drills: [
      "Implement bubble sort and count swaps",
      "Implement selection sort",
      "Implement insertion sort and apply to nearly-sorted array",
      "Implement merge sort (recursive)",
      "Implement quicksort with last element as pivot",
      "Implement quicksort with random pivot",
      "Implement counting sort for integers in range [0, k]",
      "Implement radix sort",
      "Find kth smallest using quickselect",
      "Sort array of 0s, 1s, 2s (Dutch National Flag)"
    ],
    bestPractices: [
      "Merge sort: stable, O(n log n) worst case, O(n) extra space — use for linked lists",
      "Quicksort: in-place, O(n log n) average, O(n²) worst case — use random pivot to avoid worst case",
      "Insertion sort: best for nearly sorted data or small arrays (< 20 elements)",
      "Counting/Radix sort: O(n+k) when element range is small — beats comparison sort lower bound",
      "Comparison sort lower bound is Ω(n log n) — cannot be beaten by comparison-based algorithms",
      "Timsort (Python/Java default): merge sort + insertion sort hybrid — O(n log n) worst, O(n) best",
      "Stability matters when sorting objects by one key while preserving order of another",
      "Quickselect finds Kth element in O(n) average — same partitioning logic as quicksort"
    ],
    problems: [
      { title: "Sort Colors (Dutch Flag)", link: "https://leetcode.com/problems/sort-colors/", level: "Medium" },
      { title: "Merge Intervals", link: "https://leetcode.com/problems/merge-intervals/", level: "Medium" },
      { title: "Kth Largest Element (Quickselect)", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/", level: "Medium" },
      { title: "Meeting Rooms II", link: "https://leetcode.com/problems/meeting-rooms-ii/", level: "Medium" },
      { title: "Count of Smaller Numbers After Self", link: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/", level: "Hard" },
      { title: "Largest Number", link: "https://leetcode.com/problems/largest-number/", level: "Medium" },
      { title: "Wiggle Sort II", link: "https://leetcode.com/problems/wiggle-sort-ii/", level: "Medium" },
      { title: "Sort List (Merge Sort on LL)", link: "https://leetcode.com/problems/sort-list/", level: "Medium" }
    ],
    qa: [
      { q: "Why is quicksort generally faster than merge sort in practice despite same O(n log n)?", a: "Quicksort has better cache performance — it operates in-place, so it accesses memory sequentially within partitions. Merge sort requires O(n) extra memory and the merge step accesses two separate arrays. The constant factor in quicksort's O(n log n) is smaller. However, merge sort has guaranteed O(n log n) worst case; quicksort's O(n²) worst case is avoided with random pivot." },
      { q: "What makes a sorting algorithm 'stable'?", a: "A stable sort preserves the relative order of equal elements. If two records have the same sort key, they appear in the same relative order in the sorted output as in the input. Stable: merge sort, insertion sort, bubble sort, Timsort. Unstable: quicksort, heap sort, selection sort. Stability matters when sorting by multiple keys sequentially." },
      { q: "Explain the Dutch National Flag problem and its significance.", a: "Given an array of 0s, 1s, 2s, sort it in O(n) with O(1) space. Three-pointer approach: low (boundary for 0s), mid (current), high (boundary for 2s). If arr[mid]=0: swap with low, advance both. If arr[mid]=1: advance mid. If arr[mid]=2: swap with high, retreat high only. This is the partitioning kernel of 3-way quicksort (great for arrays with many duplicates)." },
      { q: "When should you use counting sort or radix sort over comparison-based sorts?", a: "Use counting sort when elements are integers in a small known range [0, k] — O(n+k). Use radix sort when sorting integers digit by digit — O(d(n+b)) where d=digits, b=base. These are non-comparison sorts that bypass the Ω(n log n) lower bound. Not suitable for floating-point, strings, or when the range is huge." },
      { q: "What is Quickselect and how does it find the Kth element in O(n)?", a: "Quickselect uses quicksort's partitioning: after one partition, pivot is at its final sorted position. If pivot index = K-1, return pivot. If K-1 < pivot index, recurse left. If K-1 > pivot index, recurse right. Average O(n) because we only recurse into one half (not both like quicksort). Worst case O(n²) without random pivot." }
    ]
  },
  {
    id: "M10", name: "Tries & Advanced Trees", color: "#92400E",
    drills: [
      "Insert a word into a Trie",
      "Search for a word in a Trie (exact match)",
      "Search for a prefix in a Trie (startsWith)",
      "Delete a word from a Trie",
      "Count words with a given prefix",
      "Find longest word in dictionary using Trie",
      "Build a Segment Tree for range sum queries",
      "Point update on a Segment Tree",
      "Range minimum query on Segment Tree",
      "Fenwick Tree: prefix sum query and point update"
    ],
    bestPractices: [
      "Trie node: array of 26 children (for lowercase) + isEndOfWord flag",
      "Use HashMap for children if alphabet is large or sparse (saves memory)",
      "Trie search: iterate characters, at each step go to children[char] — null means not found",
      "Segment Tree: size 4×n array is safe. Index math: left child = 2i, right child = 2i+1",
      "Fenwick Tree (BIT): simpler code than Segment Tree for prefix sums only",
      "Update in Fenwick: i += i & (-i). Query: i -= i & (-i) — both O(log n)",
      "Segment Tree: use for range queries with updates (sum, min, max, GCD)",
      "Trie is better than HashMap for prefix-based operations (autocomplete, spell check)"
    ],
    problems: [
      { title: "Implement Trie (Prefix Tree)", link: "https://leetcode.com/problems/implement-trie-prefix-tree/", level: "Medium" },
      { title: "Word Search II", link: "https://leetcode.com/problems/word-search-ii/", level: "Hard" },
      { title: "Add and Search Word", link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", level: "Medium" },
      { title: "Replace Words", link: "https://leetcode.com/problems/replace-words/", level: "Medium" },
      { title: "Maximum XOR of Two Numbers", link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/", level: "Medium" },
      { title: "Range Sum Query – Mutable", link: "https://leetcode.com/problems/range-sum-query-mutable/", level: "Medium" },
      { title: "Count of Range Sum", link: "https://leetcode.com/problems/count-of-range-sum/", level: "Hard" },
      { title: "Longest Word in Dictionary", link: "https://leetcode.com/problems/longest-word-in-dictionary/", level: "Medium" }
    ],
    qa: [
      { q: "What problem does a Trie solve better than a HashMap?", a: "Trie excels at prefix-based operations: autocomplete, spell check, prefix counting. HashMap can only do exact key lookup in O(1). Trie does prefix search in O(m) where m = prefix length, regardless of how many words share that prefix. Also, Trie groups words with common prefixes together, saving memory compared to storing each word independently." },
      { q: "What is a Segment Tree and what problems does it solve?", a: "A Segment Tree is a binary tree where each node stores aggregate information (sum, min, max, GCD) for a range of the array. Build: O(n). Point update: O(log n). Range query: O(log n). It's the go-to structure when you need both updates AND range queries. If only static range queries: use sparse table for O(1) query. If only prefix queries: use Fenwick tree." },
      { q: "How does a Fenwick Tree (Binary Indexed Tree) work?", a: "A Fenwick tree uses the binary representation of indices to partition the array into cleverly-chosen ranges. Each position i stores the sum of a specific range determined by i's lowest set bit (i & -i). Prefix sum query: keep subtracting lowest set bit. Point update: keep adding lowest set bit. Both O(log n), but with much simpler code and better constants than Segment Tree." },
      { q: "When would you use a Trie over a Segment Tree?", a: "They solve completely different problems. Trie: string/word problems — autocomplete, prefix matching, word dictionaries, spell check. Segment Tree: numerical range problems on arrays — range sum, range min/max, range updates. Choose based on whether your data is string-based (Trie) or array-range-based (Segment Tree)." },
      { q: "What is the space complexity of a Trie vs storing all words in a HashSet?", a: "Trie shares prefixes — 'apple', 'app', 'application' share one path for 'app'. Total nodes ≤ sum of all character lengths, but with sharing it's typically much less. Worst case O(n×m) where n=words, m=avg length. HashSet stores each full string independently = O(n×m) always. For dictionary with many common prefixes, Trie wins on memory too." }
    ]
  }
];

const TABS = ["drills", "bestPractices", "problems", "qa"];
const TAB_LABELS = { drills: "Drills", bestPractices: "Best Practices", problems: "Problems", qa: "Deep Q&A" };
const LEVEL_COLOR = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };

export default function App() {
  const [activeModule, setActiveModule] = useState("M01");
  const [activeTab, setActiveTab] = useState("drills");
  const [openQA, setOpenQA] = useState(null);
  const [checked, setChecked] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const mod = MODULES.find(m => m.id === activeModule);

  const toggleCheck = (key) => setChecked(p => ({ ...p, [key]: !p[key] }));

  const drillsDone = MODULES.reduce((acc, m) => {
    const done = m.drills.filter((_, i) => checked[`${m.id}-d-${i}`]).length;
    return acc + done;
  }, 0);
  const totalDrills = MODULES.reduce((acc, m) => acc + m.drills.length, 0);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "var(--font-sans)", background: "var(--color-background-primary)", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 220 : 52,
        flexShrink: 0,
        borderRight: "0.5px solid var(--color-border-tertiary)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        overflow: "hidden"
      }}>
        <div style={{ padding: "14px 12px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {sidebarOpen && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>DSA Modules</span>}
          <button onClick={() => setSidebarOpen(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", fontSize: 16, padding: 0, lineHeight: 1 }}>
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 6px" }}>
          {MODULES.map(m => (
            <button key={m.id} onClick={() => setActiveModule(m.id)}
              title={m.name}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8,
                padding: "8px 8px", borderRadius: 8, border: "none", cursor: "pointer",
                background: activeModule === m.id ? m.color + "18" : "transparent",
                marginBottom: 2, textAlign: "left",
                borderLeft: activeModule === m.id ? `3px solid ${m.color}` : "3px solid transparent"
              }}>
              <span style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                background: m.color + "22", color: m.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700
              }}>{m.id.slice(1)}</span>
              {sidebarOpen && <span style={{ fontSize: 12, color: activeModule === m.id ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: activeModule === m.id ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>}
            </button>
          ))}
        </div>
        {sidebarOpen && (
          <div style={{ padding: "10px 12px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Drills progress</div>
            <div style={{ height: 4, background: "var(--color-background-secondary)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(drillsDone / totalDrills) * 100}%`, background: "#10b981", borderRadius: 2, transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>{drillsDone} / {totalDrills}</div>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: mod.color, flexShrink: 0 }} />
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text-primary)", margin: 0 }}>{mod.id} — {mod.name}</h2>
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setOpenQA(null); }}
                style={{
                  padding: "8px 16px", fontSize: 13, border: "none", cursor: "pointer",
                  background: "transparent", color: activeTab === tab ? mod.color : "var(--color-text-secondary)",
                  fontWeight: activeTab === tab ? 600 : 400,
                  borderBottom: activeTab === tab ? `2px solid ${mod.color}` : "2px solid transparent",
                  marginBottom: -1
                }}>{TAB_LABELS[tab]}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

          {/* DRILLS */}
          {activeTab === "drills" && (
            <div>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16 }}>Check off drills as you complete them. These are ordered from foundational to interview-level.</p>
              {mod.drills.map((drill, i) => {
                const key = `${mod.id}-d-${i}`;
                return (
                  <div key={i} onClick={() => toggleCheck(key)} style={{
                    display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px",
                    borderRadius: 8, cursor: "pointer", marginBottom: 6,
                    background: checked[key] ? mod.color + "0d" : "var(--color-background-secondary)",
                    border: `0.5px solid ${checked[key] ? mod.color + "40" : "var(--color-border-tertiary)"}`,
                    transition: "all 0.15s"
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                      border: `1.5px solid ${checked[key] ? mod.color : "var(--color-border-secondary)"}`,
                      background: checked[key] ? mod.color : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {checked[key] && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, color: checked[key] ? "var(--color-text-tertiary)" : "var(--color-text-primary)", textDecoration: checked[key] ? "line-through" : "none", lineHeight: 1.5 }}>
                      <span style={{ color: "var(--color-text-tertiary)", fontSize: 11, marginRight: 6 }}>{String(i + 1).padStart(2, "0")}.</span>
                      {drill}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* BEST PRACTICES */}
          {activeTab === "bestPractices" && (
            <div>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16 }}>Key rules, patterns, and mental models for this module. Internalize these before attempting problems.</p>
              {mod.bestPractices.map((bp, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, padding: "12px 14px", borderRadius: 8,
                  background: "var(--color-background-secondary)",
                  border: "0.5px solid var(--color-border-tertiary)", marginBottom: 8
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: mod.color + "18", color: mod.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: 13, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.65 }}>{bp}</p>
                </div>
              ))}
            </div>
          )}

          {/* PROBLEMS */}
          {activeTab === "problems" && (
            <div>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16 }}>Curated LeetCode problems ordered by difficulty. Solve Easy first to build pattern recognition.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {mod.problems.map((p, i) => {
                  const key = `${mod.id}-p-${i}`;
                  return (
                    <div key={i} style={{
                      padding: "12px 14px", borderRadius: 8,
                      background: checked[key] ? mod.color + "0d" : "var(--color-background-secondary)",
                      border: `0.5px solid ${checked[key] ? mod.color + "40" : "var(--color-border-tertiary)"}`,
                      display: "flex", flexDirection: "column", gap: 8
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.4 }}>{p.title}</span>
                        <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 10, background: LEVEL_COLOR[p.level] + "20", color: LEVEL_COLOR[p.level], fontWeight: 600, flexShrink: 0 }}>{p.level}</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: mod.color, textDecoration: "none", fontWeight: 500 }}>Open on LeetCode ↗</a>
                        <button onClick={() => toggleCheck(key)} style={{
                          marginLeft: "auto", fontSize: 11, padding: "3px 10px", borderRadius: 6, border: `1px solid ${checked[key] ? mod.color : "var(--color-border-secondary)"}`,
                          background: checked[key] ? mod.color : "transparent", color: checked[key] ? "#fff" : "var(--color-text-secondary)", cursor: "pointer"
                        }}>{checked[key] ? "Done ✓" : "Mark done"}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Q&A */}
          {activeTab === "qa" && (
            <div>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16 }}>Interview-level questions with detailed answers. Try answering yourself before expanding.</p>
              {mod.qa.map((item, i) => (
                <div key={i} style={{
                  borderRadius: 8, border: `0.5px solid ${openQA === i ? mod.color + "50" : "var(--color-border-tertiary)"}`,
                  marginBottom: 10, overflow: "hidden",
                  background: openQA === i ? mod.color + "06" : "var(--color-background-secondary)"
                }}>
                  <button onClick={() => setOpenQA(openQA === i ? null : i)} style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    padding: "13px 14px", background: "transparent", border: "none", cursor: "pointer", gap: 12, textAlign: "left"
                  }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: mod.color, minWidth: 18 }}>Q{i + 1}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{item.q}</span>
                    </div>
                    <span style={{ color: "var(--color-text-tertiary)", fontSize: 16, flexShrink: 0, transform: openQA === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
                  </button>
                  {openQA === i && (
                    <div style={{ padding: "0 14px 14px 14px", borderTop: `0.5px solid ${mod.color + "30"}` }}>
                      <div style={{ height: 10 }} />
                      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.75, margin: 0 }}>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
