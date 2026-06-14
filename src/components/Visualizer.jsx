import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, Plus, Trash2, ArrowUp, ArrowDown, ChevronRight, RefreshCw } from 'lucide-react';

// Static Data Structures & Initial Layouts
const initialTree = {
  val: 8, id: 1, x: 200, y: 40,
  left: {
    val: 4, id: 2, x: 100, y: 100,
    left: { val: 2, id: 4, x: 50, y: 160, left: null, right: null },
    right: { val: 6, id: 5, x: 150, y: 160, left: null, right: null }
  },
  right: {
    val: 12, id: 3, x: 300, y: 100,
    left: { val: 10, id: 6, x: 250, y: 160, left: null, right: null },
    right: { val: 15, id: 7, x: 350, y: 160, left: null, right: null }
  }
};

const initialGraph = {
  nodes: [
    { id: 'A', x: 200, y: 40 },
    { id: 'B', x: 100, y: 110 },
    { id: 'C', x: 300, y: 110 },
    { id: 'D', x: 130, y: 190 },
    { id: 'E', x: 270, y: 190 },
    { id: 'F', x: 200, y: 245 }
  ],
  edges: [
    { u: 'A', v: 'B' },
    { u: 'A', v: 'C' },
    { u: 'B', v: 'C' },
    { u: 'B', v: 'D' },
    { u: 'C', v: 'E' },
    { u: 'D', v: 'F' },
    { u: 'E', v: 'F' }
  ]
};

// Pure Helper Algorithms & Visual Layout Logic
const assignCoordinates = (node, x, y, spacingX) => {
  if (!node) return;
  node.x = x;
  node.y = y;
  if (node.left) {
    assignCoordinates(node.left, x - spacingX, y + 60, spacingX / 1.7);
  }
  if (node.right) {
    assignCoordinates(node.right, x + spacingX, y + 60, spacingX / 1.7);
  }
};

const insertIntoBST = (node, val) => {
  if (!node) {
    return { val, id: Date.now(), left: null, right: null };
  }
  if (val < node.val) {
    node.left = insertIntoBST(node.left, val);
  } else if (val > node.val) {
    node.right = insertIntoBST(node.right, val);
  }
  return node;
};

const getPreOrder = (node, acc = []) => {
  if (!node) return acc;
  acc.push(node);
  getPreOrder(node.left, acc);
  getPreOrder(node.right, acc);
  return acc;
};

const getInOrder = (node, acc = []) => {
  if (!node) return acc;
  getInOrder(node.left, acc);
  acc.push(node);
  getInOrder(node.right, acc);
  return acc;
};

const getPostOrder = (node, acc = []) => {
  if (!node) return acc;
  getPostOrder(node.left, acc);
  getPostOrder(node.right, acc);
  acc.push(node);
  return acc;
};

const getLevelOrder = (node) => {
  if (!node) return [];
  const queue = [node];
  const acc = [];
  while (queue.length > 0) {
    const curr = queue.shift();
    acc.push(curr);
    if (curr.left) queue.push(curr.left);
    if (curr.right) queue.push(curr.right);
  }
  return acc;
};

export default function Visualizer() {
  const [activeDS, setActiveDS] = useState('array');
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputVal, setInputVal] = useState('10');

  // Array states
  const [arrayData, setArrayData] = useState([12, 34, 5, 89, 21, 67]);
  const [highlightIndices, setHighlightIndices] = useState([]);
  
  // Stack & Queue states
  const [stackQueueData, setStackQueueData] = useState([15, 23, 42]);
  
  // Linked List states
  const [linkedListData, setLinkedListData] = useState([
    { id: 1, val: 5 },
    { id: 2, val: 18 },
    { id: 3, val: 29 },
    { id: 4, val: 40 }
  ]);

  // Tree states
  const [treeNodes, setTreeNodes] = useState(() => {
    const newTree = JSON.parse(JSON.stringify(initialTree));
    assignCoordinates(newTree, 250, 30, 110);
    return newTree;
  });
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(null);

  // Graph states
  const [graphQueueOrStack, setGraphQueueOrStack] = useState([]);

  // Stop animations if switching structures
  useEffect(() => {
    setIsPlaying(false);
    setHighlightIndices([]);
    setActiveNodeId(null);
    setVisitedNodes([]);
    setGraphQueueOrStack([]);
  }, [activeDS]);

  // --- ARRAY OPERATIONS ---
  const insertArrayElement = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    if (arrayData.length >= 10) {
      alert("Max array size is 10 for visualization!");
      return;
    }
    setArrayData([...arrayData, val]);
    setInputVal('');
  };

  const deleteArrayElement = (index) => {
    setArrayData(arrayData.filter((_, i) => i !== index));
  };

  const runBubbleSort = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    let arr = [...arrayData];
    
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setHighlightIndices([j, j + 1]);
        await new Promise(r => setTimeout(r, 600));

        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArrayData([...arr]);
          await new Promise(r => setTimeout(r, 400));
        }
      }
    }
    setHighlightIndices([]);
    setIsPlaying(false);
  };

  // --- STACK / QUEUE OPERATIONS ---
  const handlePush = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    if (stackQueueData.length >= 6) {
      alert("Container full (max 6 elements)!");
      return;
    }
    setStackQueueData([...stackQueueData, val]);
    setInputVal('');
  };

  const handlePop = () => {
    if (stackQueueData.length === 0) return;
    setStackQueueData(stackQueueData.slice(0, -1));
  };

  const handleEnqueue = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    if (stackQueueData.length >= 6) {
      alert("Container full (max 6)!");
      return;
    }
    setStackQueueData([...stackQueueData, val]);
    setInputVal('');
  };

  const handleDequeue = () => {
    if (stackQueueData.length === 0) return;
    setStackQueueData(stackQueueData.slice(1));
  };

  // --- LINKED LIST OPERATIONS ---
  const insertLinkedListNode = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    if (linkedListData.length >= 6) {
      alert("Linked list max size reached!");
      return;
    }
    const newNode = {
      id: Date.now(),
      val: val
    };
    setLinkedListData([...linkedListData, newNode]);
    setInputVal('');
  };

  const deleteLinkedListNode = (id) => {
    setLinkedListData(linkedListData.filter(node => node.id !== id));
  };

  // --- TREE OPERATIONS ---
  const handleBSTInsert = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    
    // Helper to check if value exists
    const searchBST = (node, target) => {
      if (!node) return false;
      if (node.val === target) return true;
      return target < node.val ? searchBST(node.left, target) : searchBST(node.right, target);
    };

    if (searchBST(treeNodes, val)) {
      alert(`Value ${val} already exists in the Binary Search Tree!`);
      return;
    }
    
    // Deep clone tree structure to trigger React updates
    let newTree = JSON.parse(JSON.stringify(treeNodes || 'null'));
    newTree = insertIntoBST(newTree, val);
    assignCoordinates(newTree, 250, 30, 110);
    setTreeNodes(newTree);
    setInputVal('');
  };

  const resetBST = () => {
    const newTree = JSON.parse(JSON.stringify(initialTree));
    assignCoordinates(newTree, 250, 30, 110);
    setTreeNodes(newTree);
    setVisitedNodes([]);
  };

  const runTreeTraversal = async (traversalType) => {
    if (isPlaying || !treeNodes) return;
    setIsPlaying(true);
    setVisitedNodes([]);
    
    let nodesList = [];
    if (traversalType === 'pre') nodesList = getPreOrder(treeNodes);
    else if (traversalType === 'in') nodesList = getInOrder(treeNodes);
    else if (traversalType === 'post') nodesList = getPostOrder(treeNodes);
    else if (traversalType === 'level') nodesList = getLevelOrder(treeNodes);

    const visited = [];
    for (let i = 0; i < nodesList.length; i++) {
      const node = nodesList[i];
      setActiveNodeId(node.id);
      await new Promise(r => setTimeout(r, 800));
      visited.push(node.val);
      setVisitedNodes([...visited]);
    }

    setActiveNodeId(null);
    setIsPlaying(false);
  };

  const renderTreeLines = (node) => {
    if (!node) return [];
    const lines = [];
    if (node.left) {
      lines.push(
        <line
          key={`line-l-${node.id}`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke="var(--text-muted)"
          strokeWidth="2"
        />
      );
      lines.push(...renderTreeLines(node.left));
    }
    if (node.right) {
      lines.push(
        <line
          key={`line-r-${node.id}`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke="var(--text-muted)"
          strokeWidth="2"
        />
      );
      lines.push(...renderTreeLines(node.right));
    }
    return lines;
  };

  const renderTreeNodes = (node) => {
    if (!node) return [];
    const nodes = [];
    const isActive = activeNodeId === node.id;
    const isVisited = visitedNodes.includes(node.val);
    
    nodes.push(
      <g key={`node-${node.id}`}>
        <circle
          cx={node.x}
          cy={node.y}
          r="16"
          fill={isActive ? 'var(--accent)' : isVisited ? 'var(--easy-glow)' : 'var(--bg-dark)'}
          stroke={isActive ? 'white' : isVisited ? 'var(--easy)' : 'var(--accent)'}
          strokeWidth="2"
          style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
        />
        <text
          x={node.x}
          y={node.y + 4}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
          fontFamily="var(--font-mono)"
        >
          {node.val}
        </text>
      </g>
    );
    nodes.push(...renderTreeNodes(node.left));
    nodes.push(...renderTreeNodes(node.right));
    return nodes;
  };

  // --- GRAPH OPERATIONS ---
  const runGraphBFS = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setVisitedNodes([]);
    setGraphQueueOrStack([]);

    // Create Adjacency Map
    const adj = {};
    initialGraph.nodes.forEach(n => adj[n.id] = []);
    initialGraph.edges.forEach(e => {
      adj[e.u].push(e.v);
      adj[e.v].push(e.u);
    });

    const queue = ['A'];
    const visited = new Set(['A']);
    const visitedList = [];

    setGraphQueueOrStack([...queue]);
    await new Promise(r => setTimeout(r, 800));

    while (queue.length > 0) {
      const curr = queue.shift();
      setActiveNodeId(curr);
      visitedList.push(curr);
      setVisitedNodes([...visitedList]);
      setGraphQueueOrStack([...queue]);
      await new Promise(r => setTimeout(r, 1000));

      const neighbors = adj[curr];
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
          setGraphQueueOrStack([...queue]);
          await new Promise(r => setTimeout(r, 600));
        }
      }
    }

    setActiveNodeId(null);
    setGraphQueueOrStack([]);
    setIsPlaying(false);
  };

  const runGraphDFS = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setVisitedNodes([]);
    setGraphQueueOrStack([]);

    // Create Adjacency Map
    const adj = {};
    initialGraph.nodes.forEach(n => adj[n.id] = []);
    initialGraph.edges.forEach(e => {
      adj[e.u].push(e.v);
      adj[e.v].push(e.u);
    });

    const stack = ['A'];
    const visited = new Set();
    const visitedList = [];

    setGraphQueueOrStack([...stack]);
    await new Promise(r => setTimeout(r, 800));

    while (stack.length > 0) {
      const curr = stack.pop();
      setGraphQueueOrStack([...stack]);

      if (!visited.has(curr)) {
        visited.add(curr);
        setActiveNodeId(curr);
        visitedList.push(curr);
        setVisitedNodes([...visitedList]);
        await new Promise(r => setTimeout(r, 1000));

        const neighbors = adj[curr];
        // Traverse in reverse order so we explore alphabetically A -> B first
        for (let idx = neighbors.length - 1; idx >= 0; idx--) {
          const n = neighbors[idx];
          if (!visited.has(n)) {
            stack.push(n);
            setGraphQueueOrStack([...stack]);
            await new Promise(r => setTimeout(r, 600));
          }
        }
      }
    }

    setActiveNodeId(null);
    setGraphQueueOrStack([]);
    setIsPlaying(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
      
      {/* Sidebar Controls */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 className="font-display text-gradient" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
            Data Structure Visualizer
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Choose a components system, input numbers, and watch step-by-step traversal steps in real-time.
          </p>
        </div>

        {/* Structures Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Select Type:</span>
          {['array', 'stackQueue', 'linkedList', 'binaryTree', 'graph'].map(ds => (
            <button
              key={ds}
              onClick={() => setActiveDS(ds)}
              disabled={isPlaying}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeDS === ds ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-color)',
                background: activeDS === ds ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: activeDS === ds ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                textTransform: 'capitalize'
              }}
            >
              {ds === 'stackQueue' ? 'Stack / Queue' : ds === 'binaryTree' ? 'Binary Search Tree' : ds === 'linkedList' ? 'Linked List' : ds === 'graph' ? 'Graph Network' : 'Array'}
            </button>
          ))}
        </div>

        {/* Input box */}
        {activeDS !== 'graph' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '16px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Element Input:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Val"
                disabled={isPlaying}
                style={{
                  width: '75px',
                  padding: '8px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'white',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
              {activeDS === 'array' && (
                <button onClick={insertArrayElement} disabled={isPlaying} className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Push
                </button>
              )}
              {activeDS === 'stackQueue' && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={handlePush} disabled={isPlaying} className="btn-primary" style={{ padding: '8px 10px', fontSize: '0.75rem' }}>
                    Push Stack
                  </button>
                  <button onClick={handleEnqueue} disabled={isPlaying} className="btn-secondary" style={{ padding: '8px 10px', fontSize: '0.75rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                    Enqueue
                  </button>
                </div>
              )}
              {activeDS === 'linkedList' && (
                <button onClick={insertLinkedListNode} disabled={isPlaying} className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Add Node
                </button>
              )}
              {activeDS === 'binaryTree' && (
                <button onClick={handleBSTInsert} disabled={isPlaying} className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Insert
                </button>
              )}
            </div>
          </div>
        )}

        {/* DS Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Available operations:</span>
          
          {activeDS === 'array' && (
            <button onClick={runBubbleSort} disabled={isPlaying} className="btn-primary" style={{ justifyContent: 'center' }}>
              <Play size={14} /> Run Bubble Sort
            </button>
          )}

          {activeDS === 'stackQueue' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={handlePop} disabled={isPlaying || stackQueueData.length === 0} className="btn-secondary" style={{ justifyContent: 'center', borderColor: 'var(--hard)', color: 'var(--hard)' }}>
                Pop Stack (LIFO)
              </button>
              <button onClick={handleDequeue} disabled={isPlaying || stackQueueData.length === 0} className="btn-secondary" style={{ justifyContent: 'center', borderColor: 'var(--medium)', color: 'var(--medium)' }}>
                Dequeue Queue (FIFO)
              </button>
            </div>
          )}

          {activeDS === 'binaryTree' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => runTreeTraversal('pre')} disabled={isPlaying} className="btn-primary" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
                Pre-order DFS
              </button>
              <button onClick={() => runTreeTraversal('in')} disabled={isPlaying} className="btn-primary" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
                In-order DFS
              </button>
              <button onClick={() => runTreeTraversal('post')} disabled={isPlaying} className="btn-primary" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
                Post-order DFS
              </button>
              <button onClick={() => runTreeTraversal('level')} disabled={isPlaying} className="btn-secondary" style={{ justifyContent: 'center', fontSize: '0.8rem', color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                Level-order BFS
              </button>
              <button onClick={resetBST} disabled={isPlaying} className="btn-secondary" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
                <RefreshCw size={12} /> Reset Tree
              </button>
            </div>
          )}

          {activeDS === 'graph' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={runGraphBFS} disabled={isPlaying} className="btn-primary" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
                BFS (Level-Order)
              </button>
              <button onClick={runGraphDFS} disabled={isPlaying} className="btn-primary" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
                DFS (Stack-Depth)
              </button>
              <button onClick={() => { setVisitedNodes([]); setGraphQueueOrStack([]); }} disabled={isPlaying} className="btn-secondary" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
                Reset Traversal
              </button>
            </div>
          )}

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '6px' }}>
            {isPlaying ? "Running animation..." : "Configure nodes and trigger operations."}
          </div>
        </div>

      </div>

      {/* Animation Workspace Screen */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '450px' }}>
        
        {/* Workspace Canvas */}
        <div className="visualizer-workspace" style={{ flexGrow: 1 }}>
          
          {/* ARRAY VIEW */}
          {activeDS === 'array' && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', padding: '20px' }}>
              {arrayData.map((val, idx) => {
                const isHighlighted = highlightIndices.includes(idx);
                return (
                  <div 
                    key={idx} 
                    className={`viz-node ${isHighlighted ? 'active' : ''}`}
                    style={{ 
                      borderRadius: '8px',
                      position: 'relative'
                    }}
                  >
                    {val}
                    <div style={{
                      position: 'absolute',
                      top: '110%',
                      fontSize: '0.65rem',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      [{idx}]
                    </div>
                    
                    {!isPlaying && (
                      <button
                        onClick={() => deleteArrayElement(idx)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: 'var(--hard)',
                          border: 'none',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '0.6rem'
                        }}
                      >
                        x
                      </button>
                    )}
                  </div>
                );
              })}
              {arrayData.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Array is empty. Add elements on the left!</span>}
            </div>
          )}

          {/* STACK & QUEUE VIEW */}
          {activeDS === 'stackQueue' && (
            <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', width: '100%', padding: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Stack (LIFO)</div>
                <div style={{
                  border: '3px solid var(--accent)',
                  borderTop: 'none',
                  borderRadius: '0 0 16px 16px',
                  width: '90px',
                  height: '240px',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  padding: '8px',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                }}>
                  {stackQueueData.map((val, idx) => (
                    <div 
                      key={idx}
                      className="viz-node active animate-fade-in"
                      style={{ 
                        width: '100%', 
                        height: '32px', 
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Queue (FIFO)</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginRight: '6px' }}>FRONT</span>
                  <div style={{
                    border: '3px solid var(--accent)',
                    borderLeft: 'none',
                    borderRight: 'none',
                    height: '56px',
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '0 8px',
                    gap: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                    borderRadius: '4px'
                  }}>
                    {stackQueueData.map((val, idx) => (
                      <div 
                        key={idx}
                        className="viz-node solved-node animate-fade-in"
                        style={{ 
                          width: '40px', 
                          height: '40px',
                          fontSize: '0.8rem'
                        }}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '6px' }}>BACK</span>
                </div>
              </div>

            </div>
          )}

          {/* LINKED LIST VIEW */}
          {activeDS === 'linkedList' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', padding: '20px' }}>
              {linkedListData.map((node, idx) => (
                <React.Fragment key={node.id}>
                  <div 
                    className="viz-node solved-node"
                    style={{ position: 'relative', width: '48px', height: '48px' }}
                  >
                    {node.val}

                    {!isPlaying && (
                      <button
                        onClick={() => deleteLinkedListNode(node.id)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: 'var(--hard)',
                          border: 'none',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '0.6rem'
                        }}
                      >
                        x
                      </button>
                    )}
                  </div>
                  {idx < linkedListData.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div className="viz-arrow" style={{ width: '40px' }} />
                    </div>
                  )}
                  {idx === linkedListData.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div className="viz-arrow" style={{ width: '30px' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>NULL</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {linkedListData.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Linked List is empty.</span>}
            </div>
          )}

          {/* BINARY TREE VIEW */}
          {activeDS === 'binaryTree' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {treeNodes ? (
                <svg width="100%" height="320" viewBox="0 0 500 320" style={{ background: 'transparent', maxWidth: '500px' }}>
                  {renderTreeLines(treeNodes)}
                  {renderTreeNodes(treeNodes)}
                </svg>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Tree is empty. Insert a value to start!</span>
              )}
            </div>
          )}

          {/* GRAPH VIEW */}
          {activeDS === 'graph' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <svg width="400" height="280" style={{ background: 'transparent' }}>
                {/* Edges */}
                {initialGraph.edges.map((edge, idx) => {
                  const uNode = initialGraph.nodes.find(n => n.id === edge.u);
                  const vNode = initialGraph.nodes.find(n => n.id === edge.v);
                  return (
                    <line
                      key={`g-edge-${idx}`}
                      x1={uNode.x}
                      y1={uNode.y}
                      x2={vNode.x}
                      y2={vNode.y}
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="2"
                    />
                  );
                })}
                {/* Nodes */}
                {initialGraph.nodes.map(node => {
                  const isActive = activeNodeId === node.id;
                  const isVisited = visitedNodes.includes(node.id);
                  return (
                    <g key={`g-node-${node.id}`}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="16"
                        fill={isActive ? 'var(--accent)' : isVisited ? 'var(--easy-glow)' : 'var(--bg-dark)'}
                        stroke={isActive ? 'white' : isVisited ? 'var(--easy)' : 'var(--accent)'}
                        strokeWidth="2"
                        style={{ transition: 'all 0.3s ease' }}
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill="white"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="var(--font-mono)"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

        </div>

        {/* Traversal Output and Stack/Queue details */}
        {(activeDS === 'binaryTree' || activeDS === 'graph') && visitedNodes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* Traversal Log */}
            <div className="glass-card animate-fade-in" style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
              <strong style={{ fontSize: '0.8rem', color: 'var(--accent)', display: 'block', marginBottom: '6px' }}>Traversal Visited Output:</strong>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                {visitedNodes.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <span style={{ color: 'white', background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(99,102,241,0.3)' }}>
                      {val}
                    </span>
                    {idx < visitedNodes.length - 1 && <ChevronRight size={12} color="var(--text-muted)" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Active Queue/Stack details for Graphs */}
            {activeDS === 'graph' && graphQueueOrStack.length > 0 && (
              <div className="glass-card animate-fade-in" style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--medium)', display: 'block', marginBottom: '6px' }}>
                  Execution State Buffer (Queue / Stack):
                </strong>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  {graphQueueOrStack.map((val, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        color: 'white', 
                        background: 'rgba(245, 158, 11, 0.15)', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid rgba(245, 158, 11, 0.3)' 
                      }}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
