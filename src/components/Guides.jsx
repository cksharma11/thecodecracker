import React, { useState } from 'react';
import { roadmap } from '../data/roadmap';
import { ArrowRight, BookOpen, Compass, Award, ExternalLink } from 'lucide-react';

export default function Guides({ problems, solvedIds, setSelectedProblem, setActiveTab }) {
  const [selectedConcept, setSelectedConcept] = useState(null);

  // Simple parser to render markdown details
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    let inList = false;
    let inCode = false;
    let inTable = false;
    let tableHeaders = [];
    const elements = [];
    let listItems = [];
    let codeLines = [];
    let tableRows = [];

    const flushList = (key) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} style={{ paddingLeft: '24px', margin: '12px 0', color: 'var(--text-secondary)' }}>
            {listItems.map((item, i) => <li key={i} style={{ marginBottom: '6px' }}>{item}</li>)}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    const flushCode = (key) => {
      if (codeLines.length > 0) {
        elements.push(
          <pre key={`code-${key}`} style={{
            background: '#1e1e1e',
            color: '#a9b2c3',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            overflowX: 'auto',
            margin: '16px 0',
            border: '1px solid var(--border-color)'
          }}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
      }
      inCode = false;
    };

    const flushTable = (key) => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-wrapper-${key}`} style={{ overflowX: 'auto', margin: '16px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid var(--border-color)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '2px solid var(--border-color)' }}>
                  {tableHeaders.map((h, i) => (
                    <th key={i} style={{ padding: '10px 14px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: '10px 14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        tableHeaders = [];
      }
      inTable = false;
    };

    lines.forEach((line, idx) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCode) {
          flushCode(idx);
        } else {
          flushList(idx);
          flushTable(idx);
          inCode = true;
        }
        return;
      }

      if (inCode) {
        codeLines.push(line);
        return;
      }

      // Tables
      if (line.trim().startsWith('|')) {
        flushList(idx);
        flushCode(idx);
        inTable = true;
        
        // Parse row cells
        const cells = line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
        
        // Skip separator lines like | :--- | :--- |
        if (cells.every(c => c.startsWith(':---') || c.startsWith('---') || c.startsWith('-') || c.endsWith(':'))) {
          return;
        }

        if (tableHeaders.length === 0) {
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        return;
      } else {
        if (inTable) {
          flushTable(idx);
        }
      }

      // Headers
      if (line.startsWith('### ')) {
        flushList(idx);
        elements.push(
          <h3 className="font-display text-gradient" key={idx} style={{ fontSize: '1.25rem', fontWeight: 600, margin: '24px 0 12px 0' }}>
            {line.substring(4)}
          </h3>
        );
        return;
      }
      if (line.startsWith('#### ')) {
        flushList(idx);
        elements.push(
          <h4 className="font-display" key={idx} style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: '18px 0 8px 0' }}>
            {line.substring(5)}
          </h4>
        );
        return;
      }

      // Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        inList = true;
        // Strip prefix and parse basic bold inline matching
        let cleanText = line.trim().substring(2);
        
        // Basic parser for **bold** and `code` markers
        const parts = cleanText.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} style={{ color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={pIdx} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{part.slice(1, -1)}</code>;
          }
          return part;
        });

        listItems.push(<span key={idx}>{parts}</span>);
        return;
      } else {
        if (inList) {
          flushList(idx);
        }
      }

      // Empty Lines
      if (line.trim() === '') {
        return;
      }

      // Paragraphs (standard text)
      // Process bold/code markers
      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={pIdx} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{part.slice(1, -1)}</code>;
        }
        return part;
      });

      elements.push(
        <p key={idx} style={{ margin: '10px 0', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          {parts}
        </p>
      );
    });

    // Cleanup residual elements
    flushList('end');
    flushCode('end');
    flushTable('end');

    return elements;
  };

  const selectProblem = (id) => {
    const prob = problems.find(p => p.id === id);
    if (prob) {
      setSelectedProblem(prob);
      setActiveTab('workspace');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: selectedConcept ? '1fr 1fr' : '1fr', gap: '24px', transition: 'grid-template-columns 0.3s ease' }}>
      
      {/* Left List of stages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ marginBottom: '4px' }}>
          <h1 className="font-display text-gradient" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            DSA Conceptual Learning Roadmap
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Follow a structured study path through 4 stages from sorting baselines to dynamic graphs.
          </p>
        </div>
        
        {roadmap.map((stage) => (
          <div key={stage.stage} className="glass-panel" style={{ padding: '24px' }}>
            {/* Stage Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--accent)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  Stage {stage.stage}
                </span>
                <span className={`badge ${stage.difficulty === 'Beginner' ? 'badge-easy' : stage.difficulty === 'Intermediate' ? 'badge-medium' : 'badge-hard'}`}>
                  {stage.difficulty}
                </span>
              </div>
            </div>

            <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {stage.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              {stage.description}
            </p>

            {/* Concepts Grid inside Stage */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {stage.concepts.map((concept) => {
                const isSelected = selectedConcept && selectedConcept.id === concept.id;
                
                // Calculate solved stats for this concept
                const solvedCount = concept.linkedProblems.filter(id => solvedIds.has(id)).length;
                const totalCount = concept.linkedProblems.length;
                const isFinished = solvedCount === totalCount;

                return (
                  <div
                    key={concept.id}
                    className="glass-card"
                    onClick={() => setSelectedConcept(concept)}
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(99,102,241,0.05)' : 'rgba(17,24,39,0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '140px',
                      padding: '16px',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <h4 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {concept.name}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {concept.summary}
                      </p>
                    </div>

                    {/* Completion bar */}
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <span>Progress</span>
                        <span>{solvedCount}/{totalCount} Solved</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                        <div style={{
                          width: `${(solvedCount / totalCount) * 100}%`,
                          height: '100%',
                          background: isFinished ? 'var(--easy)' : 'var(--accent)',
                          borderRadius: '2px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Right Guide Content Display */}
      {selectedConcept ? (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)', minHeight: '500px', overflowY: 'auto', position: 'sticky', top: '80px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} color="var(--accent)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>STUDY GUIDE</span>
              </div>
              <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '4px' }}>
                {selectedConcept.name}
              </h2>
            </div>
            <button
              onClick={() => setSelectedConcept(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1.25rem'
              }}
            >
              &times;
            </button>
          </div>

          {/* Guide Markdown Body */}
          <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {renderMarkdown(selectedConcept.guide)}
          </div>

          {/* Linked Problems footer */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 className="font-display" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Practice Core Challenges ({selectedConcept.linkedProblems.length}):
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedConcept.linkedProblems.map((pId) => {
                const prob = problems.find(p => p.id === pId);
                if (!prob) return null;
                const isSolved = solvedIds.has(pId);
                
                return (
                  <div
                    key={pId}
                    onClick={() => selectProblem(pId)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(0,0,0,0.15)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateX(2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isSolved ? 'var(--easy)' : 'var(--text-muted)'
                      }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        #{prob.id}. {prob.title}
                      </span>
                      <span className={`badge ${prob.difficulty === 'Easy' ? 'badge-easy' : prob.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                        {prob.difficulty}
                      </span>
                    </div>
                    <ArrowRight size={14} color="var(--accent)" />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
