import React, { useState } from 'react';
import { systemDesignQuestions } from '../data/systemDesign';
import { Search, Server, Database, Network, Cpu, ArrowRight, ChevronRight, Layers, HelpCircle, HardDrive } from 'lucide-react';

export default function SystemDesign() {
  const [selectedId, setSelectedId] = useState(1);
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const selectedQuestion = systemDesignQuestions.find(q => q.id === selectedId) || systemDesignQuestions[0];

  // Unique categories list
  const categories = ['All', 'Web Applications', 'Distributed Systems', 'Infrastructure', 'Real-Time / Geo'];

  // Filtered questions
  const filteredQuestions = systemDesignQuestions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Helper to determine difficulty badge colors
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'badge-easy';
      case 'medium': return 'badge-medium';
      case 'hard': return 'badge-hard';
      default: return '';
    }
  };

  // Helper to map component names to icons
  const getComponentIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('client') || n.includes('user')) return <Cpu size={18} />;
    if (n.includes('load balancer') || n.includes('lb') || n.includes('gateway')) return <Network size={18} />;
    if (n.includes('app') || n.includes('web') || n.includes('worker') || n.includes('server')) return <Server size={18} />;
    if (n.includes('cache') || n.includes('redis') || n.includes('memcached') || n.includes('queue') || n.includes('kafka')) return <Layers size={18} fill="none" />;
    return <Database size={18} />;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', height: 'calc(100vh - 110px)' }}>
      
      {/* Sidebar - Search, Filter & List */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'hidden' }}>
        
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Category:</span>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                outline: 'none',
                marginTop: '4px'
              }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Difficulty:</span>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    fontSize: '0.75rem',
                    background: selectedDifficulty === d ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: '1px solid',
                    borderColor: selectedDifficulty === d ? 'var(--accent)' : 'var(--border-color)',
                    color: selectedDifficulty === d ? 'white' : 'var(--text-secondary)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }} className="custom-scrollbar">
          {filteredQuestions.map(q => (
            <div
              key={q.id}
              onClick={() => { setSelectedId(q.id); setActiveSubTab('overview'); }}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedId === q.id ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                background: selectedId === q.id ? 'rgba(99, 102, 241, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="list-item-hover"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: selectedId === q.id ? 'var(--accent)' : 'white' }}>
                  {q.title}
                </span>
                <span className={`badge ${getDifficultyBadge(q.difficulty)}`} style={{ fontSize: '0.65rem', padding: '1px 6px', flexShrink: 0 }}>
                  {q.difficulty}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                {q.summary}
              </p>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '20px' }}>
              No system design questions match filters.
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <span className={`badge ${getDifficultyBadge(selectedQuestion.difficulty)}`}>
                {selectedQuestion.difficulty}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 500 }}>
                {selectedQuestion.category}
              </span>
            </div>
            <h2 className="font-display text-gradient" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {selectedQuestion.title}
            </h2>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '2px' }}>
          {[
            { id: 'overview', label: '1. Overview' },
            { id: 'architecture', label: '2. High-Level Architecture' },
            { id: 'deepdive', label: '3. Deep Dive Details' },
            { id: 'tradeoffs', label: '4. Trade-offs & Decisions' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid',
                borderBottomColor: activeSubTab === tab.id ? 'var(--accent)' : 'transparent',
                color: activeSubTab === tab.id ? 'white' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: activeSubTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* OVERVIEW TAB */}
          {activeSubTab === 'overview' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Summary */}
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600, marginBottom: '6px' }}>Summary</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {selectedQuestion.summary}
                </p>
              </div>

              {/* Requirements */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--easy)', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={16} /> Functional Requirements
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px', listStyleType: 'disc', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {selectedQuestion.requirements.functional.map((req, idx) => (
                      <li key={idx} style={{ lineHeight: '1.4' }}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--medium)', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={16} /> Non-Functional Requirements
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px', listStyleType: 'disc', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {selectedQuestion.requirements.nonFunctional.map((req, idx) => (
                      <li key={idx} style={{ lineHeight: '1.4' }}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Capacity Estimation */}
              <div className="glass-card" style={{ padding: '16px', background: 'rgba(99,102,241,0.02)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '6px' }}>Scale & Capacity Estimation</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontFamily: 'var(--font-mono)' }}>
                  {selectedQuestion.estimations}
                </p>
              </div>

              {/* API Contracts */}
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600, marginBottom: '10px' }}>System Interface (API Contracts)</h4>
                <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '10px 14px', color: 'white', fontWeight: 600 }}>Method / Route</th>
                        <th style={{ padding: '10px 14px', color: 'white', fontWeight: 600 }}>Description</th>
                        <th style={{ padding: '10px 14px', color: 'white', fontWeight: 600 }}>Request Body</th>
                        <th style={{ padding: '10px 14px', color: 'white', fontWeight: 600 }}>Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuestion.apis.map((api, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < selectedQuestion.apis.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                            <span className={`badge ${api.method === 'POST' ? 'badge-hard' : api.method === 'GET' ? 'badge-easy' : 'badge-medium'}`} style={{ marginRight: '6px', fontSize: '0.65rem' }}>
                              {api.method}
                            </span>
                            {api.path}
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{api.desc}</td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{api.request}</td>
                          <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--easy)' }}>{api.response}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ARCHITECTURE TAB */}
          {activeSubTab === 'architecture' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Interactive Block Diagram */}
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600, marginBottom: '16px' }}>
                  High-Level Component Flow
                </h4>
                
                {/* Visual Architecture Grid */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '24px 16px',
                  flexWrap: 'wrap',
                  gap: '16px',
                  minHeight: '120px'
                }}>
                  {/* Generate simple horizontal flowchart */}
                  {selectedQuestion.highLevelFlow.map((flow, idx) => (
                    <React.Fragment key={idx}>
                      {/* Node From */}
                      <div className="glass-card" style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(0,0,0,0.4) 100%)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {getComponentIcon(flow.from)}
                        {flow.from}
                      </div>

                      {/* Connection Arrow & Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexGrow: 1, minWidth: '80px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>{flow.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <div style={{ height: '2px', background: 'rgba(99,102,241,0.3)', flexGrow: 1 }} />
                          <ArrowRight size={12} color="var(--accent)" style={{ marginLeft: '-4px' }} />
                        </div>
                      </div>

                      {/* If last connection, draw Node To */}
                      {idx === selectedQuestion.highLevelFlow.length - 1 && (
                        <div className="glass-card" style={{
                          padding: '12px 16px',
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0.4) 100%)',
                          border: '1px solid rgba(16,185,129,0.25)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          {getComponentIcon(flow.to)}
                          {flow.to}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Data Model / Database Schema */}
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600, marginBottom: '8px' }}>
                  Database Strategy & Schema Selection
                </h4>
                <div className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DATABASE TYPE:</span>
                    <div style={{ fontSize: '0.85rem', color: 'var(--easy)', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HardDrive size={14} /> {selectedQuestion.dataModel.type}
                    </div>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.03)' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SCHEMA DETAIL:</span>
                    <pre style={{
                      marginTop: '6px',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.4',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedQuestion.dataModel.schema}
                    </pre>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* DEEP DIVE TAB */}
          {activeSubTab === 'deepdive' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600 }}>System Deep Dive & Subsystems Scaling</h4>
              <div className="glass-card" style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {selectedQuestion.deepDive.split('. ').map((sentence, idx) => {
                  if (!sentence.trim()) return null;
                  return (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <ChevronRight size={14} color="var(--accent)" style={{ marginTop: '5px', flexShrink: 0 }} />
                      <span>{sentence.trim()}{sentence.endsWith('.') ? '' : '.'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TRADE-OFFS TAB */}
          {activeSubTab === 'tradeoffs' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600 }}>Architectural Trade-offs & CAP Decisions</h4>
              <div className="glass-card" style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <HelpCircle size={16} color="var(--medium)" style={{ marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'white', display: 'block', marginBottom: '4px' }}>Key Trade-offs Discussion:</strong>
                    <span>{selectedQuestion.tradeoffs}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
