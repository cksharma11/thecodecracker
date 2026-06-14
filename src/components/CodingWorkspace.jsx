import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, RefreshCw, BookOpen, FileCode, CheckCircle, XCircle, Code, FileText } from 'lucide-react';

export default function CodingWorkspace({ 
  problem, 
  onSolved, 
  onAttempted,
  savedCodes, 
  saveCode, 
  savedNotes, 
  saveNote 
}) {
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('editor');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  // Local state for the notes editor (debounced sync to parent)
  const [notes, setNotes] = useState('');
  
  // Code editor text
  const [code, setCode] = useState('');
  
  // Execution status
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [executionError, setExecutionError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Sync state when problem or language changes
  useEffect(() => {
    if (problem) {
      // Load saved code draft or default template
      const langCodes = savedCodes[problem.id] || {};
      const savedText = langCodes[selectedLanguage];
      setCode(savedText !== undefined ? savedText : (problem.templates[selectedLanguage] || ''));
      
      // Load notes
      setNotes(savedNotes[problem.id] || '');
      
      // Reset runner states
      setTestResults(null);
      setConsoleLogs([]);
      setExecutionError('');
      setActiveRightTab('editor');
    }
  }, [problem, selectedLanguage]);

  // Save notes to localStorage
  const handleNotesChange = (e) => {
    const text = e.target.value;
    setNotes(text);
    saveNote(problem.id, text);
  };

  // Save code drafts
  const handleEditorChange = (value) => {
    setCode(value);
    saveCode(problem.id, selectedLanguage, value);
  };

  // Reset current template code
  const resetCode = () => {
    if (window.confirm("Are you sure you want to reset the editor to the default template? This will erase your current draft.")) {
      const defaultCode = problem.templates[selectedLanguage] || '';
      setCode(defaultCode);
      saveCode(problem.id, selectedLanguage, defaultCode);
    }
  };

  // Web Worker Execution Engine
  const runCodeInSandbox = () => {
    if (selectedLanguage !== 'javascript' && selectedLanguage !== 'python') {
      alert("Browser-based execution is available for JavaScript and Python. For C++ and Java, you can review the solutions in the 'Solution' tab!");
      return;
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      alert("No test cases defined for this problem. You can submit to mock complete, or write code!");
      return;
    }

    setIsRunning(true);
    setExecutionError('');
    setTestResults(null);
    setConsoleLogs([]);
    setStatusMessage(selectedLanguage === 'javascript' ? 'Executing JavaScript tests...' : 'Loading Python WASM Runtime (~5MB)...');
    setActiveRightTab('results');

    // Make sure problem is registered as attempted
    onAttempted(problem.id);

    // Extract entry function name from the JS template
    const getFnName = (templateCode) => {
      const funcMatch = templateCode.match(/(?:function|class)\s+([a-zA-Z0-9_$]+)/);
      if (funcMatch) return funcMatch[1];
      
      const varMatch = templateCode.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*/);
      if (varMatch) return varMatch[1];
      
      return 'twoSum'; // default fallback
    };
    
    const entryFnName = getFnName(problem.templates.javascript || '');

    // Dynamic Worker logic inside string
    const workerCode = `
      self.onmessage = async function(event) {
        const { code, testCases, language } = event.data;
        const logs = [];
        
        // Custom console interceptor
        const customConsole = {
          log: function(...args) {
            logs.push(args.map(a => {
              if (typeof a === 'object') {
                try { return JSON.stringify(a); } catch(e) { return String(a); }
              }
              return String(a);
            }).join(' '));
          }
        };

        try {
          if (language === 'javascript') {
            // Compile user code dynamically with explicit return of the main entrypoint
            const runCode = code + "\\n\\nif (typeof ${entryFnName} !== 'undefined') { return ${entryFnName}; } else { throw new Error(\\"Function ${entryFnName} was not found in your code.\\"); }";
            
            const userFn = new Function('console', runCode)(customConsole);
            
            if (typeof userFn !== 'function') {
              throw new Error("Your code must define a valid function named ${entryFnName}.");
            }

            const results = [];
            let allPassed = true;

            for (let i = 0; i < testCases.length; i++) {
              const tc = testCases[i];
              const input = tc.input; // Arguments array
              const expected = tc.expected;

              // Deep clone input to avoid user code modifying test arrays
              const clonedInput = JSON.parse(JSON.stringify(input));

              const t0 = performance.now();
              const actual = userFn(...clonedInput);
              const t1 = performance.now();

              const isCorrect = JSON.stringify(actual) === JSON.stringify(expected);
              if (!isCorrect) allPassed = false;

              results.push({
                index: i,
                inputStr: tc.inputStr,
                expected: JSON.stringify(expected),
                actual: JSON.stringify(actual),
                passed: isCorrect,
                duration: (t1 - t0).toFixed(2)
              });
            }

            self.postMessage({
              success: true,
              allPassed,
              results,
              logs
            });
          } else if (language === 'python') {
            self.postMessage({ type: 'STATUS', message: 'Loading Python WASM Runtime (~5MB)...' });
            
            if (!self.pyodide) {
              importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
              self.pyodide = await loadPyodide();
            }

            self.postMessage({ type: 'STATUS', message: 'Compiling Python code...' });

            // Intercept print() statement
            self.pyodide.setStdout({
              write: (text) => {
                if (text.trim()) {
                  logs.push(text.trim());
                }
                return text.length;
              }
            });

            // Execute user's python script to register the functions
            await self.pyodide.runPythonAsync(code);

            self.postMessage({ type: 'STATUS', message: 'Evaluating test cases...' });

            const results = [];
            let allPassed = true;

            for (let i = 0; i < testCases.length; i++) {
              const tc = testCases[i];
              const input = tc.input;
              const expected = tc.expected;
              const clonedInput = JSON.parse(JSON.stringify(input));

              // Load JS args into Python
              self.pyodide.globals.set("js_args", clonedInput);
              
              const t0 = performance.now();
              
              // Run inside python to convert JsProxy array elements to native Python lists/tuples
              const pyResult = await self.pyodide.runPythonAsync(
                "py_args = [x.to_py() if hasattr(x, 'to_py') else x for x in js_args]\\n" +
                "${entryFnName}(*py_args)"
              );
              
              const t1 = performance.now();

              // Convert Python value back to JS
              const actual = pyResult && typeof pyResult.toJs === 'function' ? pyResult.toJs() : pyResult;

              if (pyResult && typeof pyResult.destroy === 'function') {
                pyResult.destroy();
              }

              const isCorrect = JSON.stringify(actual) === JSON.stringify(expected);
              if (!isCorrect) allPassed = false;

              results.push({
                index: i,
                inputStr: tc.inputStr,
                expected: JSON.stringify(expected),
                actual: JSON.stringify(actual),
                passed: isCorrect,
                duration: (t1 - t0).toFixed(2)
              });
            }

            self.postMessage({
              success: true,
              allPassed,
              results,
              logs
            });
          }
        } catch (err) {
          self.postMessage({
            success: false,
            error: err.message || String(err),
            logs
          });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    let worker;

    try {
      worker = new Worker(workerUrl);
    } catch (e) {
      setIsRunning(false);
      setExecutionError("Web Worker failed to initialize: " + e.message);
      return;
    }

    // Set dynamic watchdog timer (JavaScript: 2.5s, Python: 15s to allow load/first fetch)
    const watchdogTimeout = selectedLanguage === 'javascript' ? 2500 : 15000;
    const timeoutId = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      setIsRunning(false);
      setExecutionError(selectedLanguage === 'javascript'
        ? "Execution Timeout: Potential infinite loop or long runtime detected (> 2.5s)."
        : "Execution Timeout: Potential infinite loop or loading timeout detected (> 15.0s)."
      );
    }, watchdogTimeout);

    worker.onmessage = (e) => {
      const data = e.data;
      if (data.type === 'STATUS') {
        setStatusMessage(data.message);
        return;
      }

      clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      setIsRunning(false);
      
      if (data.success) {
        setTestResults(data.results);
        setConsoleLogs(data.logs);
        
        // If all passed, user solved the problem
        if (data.allPassed) {
          onSolved(problem.id, selectedLanguage);
        }
      } else {
        setExecutionError(data.error);
        setConsoleLogs(data.logs);
      }
    };

    worker.onerror = (err) => {
      clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      setIsRunning(false);
      setExecutionError("Runtime Error: " + err.message);
    };

    // Trigger execution
    worker.postMessage({
      code: code,
      testCases: problem.testCases,
      language: selectedLanguage
    });
  };

  // Submit code (for JS/Python runs runner, otherwise mock submit)
  const submitCode = () => {
    if (selectedLanguage === 'javascript' || selectedLanguage === 'python') {
      runCodeInSandbox();
    } else {
      // Non-JS Mock submission
      const confirmSubmit = window.confirm(`Local compiler executes JavaScript and Python. Would you like to submit your ${selectedLanguage.toUpperCase()} code as a complete solution?`);
      if (confirmSubmit) {
        onSolved(problem.id, selectedLanguage);
        alert("Solution submitted successfully! Check your Dashboard stats!");
      }
    }
  };

  const getDifficultyClass = (diff) => {
    if (diff === 'Easy') return 'badge-easy';
    if (diff === 'Medium') return 'badge-medium';
    return 'badge-hard';
  };

  return (
    <div className="split-workspace animate-fade-in">
      
      {/* Left Workspace Panel */}
      <div className="panel-left glass-panel">
        
        {/* Left Tabs Header */}
        <div className="panel-header">
          <button 
            className={`panel-tab ${activeLeftTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveLeftTab('description')}
          >
            <BookOpen size={14} style={{ marginRight: '6px', display: 'inline' }} />
            Description
          </button>
          <button 
            className={`panel-tab ${activeLeftTab === 'solution' ? 'active' : ''}`}
            onClick={() => setActiveLeftTab('solution')}
          >
            <Code size={14} style={{ marginRight: '6px', display: 'inline' }} />
            Solutions
          </button>
          <button 
            className={`panel-tab ${activeLeftTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveLeftTab('notes')}
          >
            <FileText size={14} style={{ marginRight: '6px', display: 'inline' }} />
            Notes
          </button>
        </div>

        {/* Left Tabs Body */}
        <div className="panel-body">
          
          {activeLeftTab === 'description' && problem && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Problem Title & Meta Info */}
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {problem.id}. {problem.title}
                  </span>
                  <span className={`badge ${getDifficultyClass(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {problem.companyTags && problem.companyTags.map(company => (
                    <span 
                      key={company} 
                      style={{ 
                        fontSize: '0.65rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid var(--border-color)', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description Body */}
              <div 
                style={{ 
                  color: 'var(--text-primary)', 
                  whiteSpace: 'pre-wrap', 
                  fontSize: '0.92rem', 
                  lineHeight: '1.6',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                {problem.description}
              </div>

              {/* Examples */}
              {problem.examples && problem.examples.map((ex, index) => (
                <div key={index} style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '0.85rem'
                }}>
                  <strong style={{ display: 'block', color: 'var(--accent)', marginBottom: '6px' }}>Example {index + 1}:</strong>
                  <div style={{ fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Input:</span> {ex.input}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Output:</span> {ex.output}
                  </div>
                  {ex.explanation && (
                    <div style={{ marginTop: '6px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      <strong>Explanation:</strong> {ex.explanation}
                    </div>
                  )}
                </div>
              ))}

              {/* Constraints */}
              {problem.constraints && problem.constraints.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Constraints:</strong>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {problem.constraints.map((c, i) => (
                      <li key={i} style={{ marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}

          {activeLeftTab === 'solution' && problem && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Optimal Solution Details */}
              {problem.explanation && problem.explanation.optimal ? (
                <div>
                  <h3 className="font-display text-gradient" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>
                    Optimal Approach
                  </h3>
                  <div style={{ fontSize: '0.85rem', padding: '6px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '6px', color: 'var(--easy)', display: 'inline-block', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
                    Complexity: {problem.explanation.optimal.complexity}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {problem.explanation.optimal.explanation}
                  </p>
                  
                  {problem.explanation.optimal.code && (
                    <pre style={{
                      background: '#1e1e1e',
                      padding: '16px',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      overflowX: 'auto',
                      border: '1px solid var(--border-color)',
                      color: '#9cdcfe'
                    }}>
                      <code>{problem.explanation.optimal.code}</code>
                    </pre>
                  )}
                </div>
              ) : null}

              {/* Brute Force Details */}
              {problem.explanation && problem.explanation.bruteForce ? (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    Brute Force Approach
                  </h3>
                  <div style={{ fontSize: '0.85rem', padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: 'var(--hard)', display: 'inline-block', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
                    Complexity: {problem.explanation.bruteForce.complexity}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {problem.explanation.bruteForce.explanation}
                  </p>

                  {problem.explanation.bruteForce.code && (
                    <pre style={{
                      background: '#1e1e1e',
                      padding: '16px',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      overflowX: 'auto',
                      border: '1px solid var(--border-color)',
                      color: '#d4d4d4'
                    }}>
                      <code>{problem.explanation.bruteForce.code}</code>
                    </pre>
                  )}
                </div>
              ) : (
                !problem.explanation && <div style={{ color: 'var(--text-muted)' }}>Solution details coming soon!</div>
              )}
            </div>
          )}

          {activeLeftTab === 'notes' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Personal Study Notes (Saved Automatically)
                </span>
              </div>
              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Write your notes here... (e.g. algorithms to remember, tricks, dry runs)"
                style={{
                  flexGrow: 1,
                  minHeight: '350px',
                  width: '100%',
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: '1.6'
                }}
              />
            </div>
          )}

        </div>
      </div>

      {/* Right Workspace Panel */}
      <div className="panel-right glass-panel">
        
        {/* Right Panel Tabs Header */}
        <div className="panel-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <button 
              className={`panel-tab ${activeRightTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveRightTab('editor')}
            >
              <FileCode size={14} style={{ marginRight: '6px', display: 'inline' }} />
              Editor
            </button>
            <button 
              className={`panel-tab ${activeRightTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveRightTab('results')}
            >
              <CheckCircle size={14} style={{ marginRight: '6px', display: 'inline' }} />
              Test Results
            </button>
          </div>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '8px' }}>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                padding: '4px 8px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="javascript">JavaScript (Runner Active)</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>

        {/* Right Panel Body */}
        <div style={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          background: '#1e1e1e',
          overflow: 'hidden'
        }}>
          {activeRightTab === 'editor' ? (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="code-editor-container">
                <Editor
                  height="100%"
                  language={selectedLanguage}
                  value={code}
                  theme="vs-dark"
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: 'var(--font-mono)',
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    padding: { top: 12, bottom: 12 }
                  }}
                />
              </div>

              {/* Editor Bottom Actions */}
              <div className="editor-footer">
                <button 
                  onClick={resetCode} 
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <RefreshCw size={14} /> Reset
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={runCodeInSandbox} 
                    disabled={isRunning}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.85rem', color: 'var(--accent)' }}
                  >
                    <Play size={14} /> Run Code
                  </button>
                  <button 
                    onClick={submitCode} 
                    disabled={isRunning}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    <Send size={14} /> Submit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Results & Console Tab */
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '20px', background: 'var(--bg-dark)', overflowY: 'auto' }}>
              {isRunning ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
                  <RefreshCw className="animate-spin" size={32} color="var(--accent)" style={{ animation: 'spin 1.5s linear infinite' }} />
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{statusMessage}</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Compilation Success/Fail Alert */}
                  {executionError ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px 16px', borderRadius: '8px' }}>
                      <XCircle size={24} color="var(--hard)" />
                      <div>
                        <strong style={{ color: 'var(--hard)', fontSize: '0.9rem' }}>Compilation / Runtime Error</strong>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                          {executionError}
                        </div>
                      </div>
                    </div>
                  ) : testResults ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: testResults.every(r => r.passed) ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: '1px solid', borderColor: testResults.every(r => r.passed) ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', padding: '12px 16px', borderRadius: '8px' }}>
                      {testResults.every(r => r.passed) ? (
                        <CheckCircle size={24} color="var(--easy)" />
                      ) : (
                        <XCircle size={24} color="var(--hard)" />
                      )}
                      <div>
                        <strong style={{ color: testResults.every(r => r.passed) ? 'var(--easy)' : 'var(--hard)', fontSize: '0.9rem' }}>
                          {testResults.every(r => r.passed) ? "All Test Cases Passed!" : "Some Test Cases Failed"}
                        </strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {testResults.filter(r => r.passed).length} / {testResults.length} test cases passed.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '48px 0' }}>
                      No tests executed. Write your code and click <strong>Run Code</strong>.
                    </div>
                  )}

                  {/* Individual Test Cases Results */}
                  {testResults && testResults.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                        Test Cases:
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {testResults.map((res, index) => (
                          <div 
                            key={index}
                            style={{
                              background: 'rgba(0,0,0,0.2)',
                              border: '1px solid',
                              borderColor: res.passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                              borderRadius: '8px',
                              padding: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: res.passed ? 'var(--easy)' : 'var(--hard)' }}>
                                Case {index + 1}: {res.passed ? "Passed" : "Failed"}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {res.duration} ms
                              </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                              <div><span style={{ color: 'var(--text-secondary)' }}>Input:</span> {res.inputStr}</div>
                              <div><span style={{ color: 'var(--text-secondary)' }}>Expected:</span> {res.expected}</div>
                              <div><span style={{ color: 'var(--text-secondary)' }}>Output:</span> <span style={{ color: res.passed ? 'var(--easy)' : 'var(--hard)' }}>{res.actual}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Console stdout logs */}
                  {consoleLogs && consoleLogs.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                        Console Output:
                      </h4>
                      <div className="console-container">
                        {consoleLogs.map((log, idx) => (
                          <div key={idx} className="console-log">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Switch Back to Editor Button */}
                  <button 
                    onClick={() => setActiveRightTab('editor')}
                    className="btn-secondary"
                    style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}
                  >
                    Go Back to Editor
                  </button>

                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
