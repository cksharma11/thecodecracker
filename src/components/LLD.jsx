import { useState } from 'react';
import { lldTopics } from '../data/lld';
import { Search, HelpCircle, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';

export default function LLD() {
  const [selectedId, setSelectedId] = useState(1);
  const [activeSubTab, setActiveSubTab] = useState('explanation');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComplexity, setSelectedComplexity] = useState('All');

  const selectedTopic = lldTopics.find(t => t.id === selectedId) || lldTopics[0];

  const categories = ['All', 'SOLID Principles', 'Design Patterns', 'Refactoring Practices'];

  const filteredTopics = lldTopics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'All' || t.complexity === selectedComplexity;
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const getComplexityBadge = (complexity) => {
    switch (complexity.toLowerCase()) {
      case 'easy': return 'badge-easy';
      case 'medium': return 'badge-medium';
      case 'hard': return 'badge-hard';
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', height: 'calc(100vh - 110px)' }}>
      
      {/* Sidebar Section */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'hidden' }}>
        
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search LLD topics..."
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
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Complexity:</span>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              {['All', 'Easy', 'Medium', 'Hard'].map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedComplexity(c)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    fontSize: '0.75rem',
                    background: selectedComplexity === c ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: '1px solid',
                    borderColor: selectedComplexity === c ? 'var(--accent)' : 'var(--border-color)',
                    color: selectedComplexity === c ? 'white' : 'var(--text-secondary)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }} className="custom-scrollbar">
          {filteredTopics.map(t => (
            <div
              key={t.id}
              onClick={() => { setSelectedId(t.id); setActiveSubTab('explanation'); }}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedId === t.id ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                background: selectedId === t.id ? 'rgba(99, 102, 241, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="list-item-hover"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: selectedId === t.id ? 'var(--accent)' : 'white' }}>
                  {t.title}
                </span>
                <span className={`badge ${getComplexityBadge(t.complexity)}`} style={{ fontSize: '0.65rem', padding: '1px 6px', flexShrink: 0 }}>
                  {t.complexity}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                {t.summary}
              </p>
            </div>
          ))}

          {filteredTopics.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '20px' }}>
              No LLD topics match the active filters.
            </div>
          )}
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
        
        {/* Topic Header */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <span className={`badge ${getComplexityBadge(selectedTopic.complexity)}`}>
                {selectedTopic.complexity}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 500 }}>
                {selectedTopic.category}
              </span>
            </div>
            <h2 className="font-display text-gradient" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {selectedTopic.title}
            </h2>
          </div>
        </div>

        {/* Sub tabs */}
        <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '2px' }}>
          {[
            { id: 'explanation', label: '1. Concept Explanation' },
            { id: 'structure', label: '2. Structure & UML' },
            { id: 'comparison', label: '3. Before vs After Code' },
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

        {/* Tab contents */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Explanation Tab */}
          {activeSubTab === 'explanation' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600, marginBottom: '6px' }}>Overview</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {selectedTopic.summary}
                </p>
              </div>

              <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={16} color="var(--accent)" /> Detailed Walkthrough
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {selectedTopic.explanation}
                </p>
              </div>
            </div>
          )}

          {/* UML & Structure Tab */}
          {activeSubTab === 'structure' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600 }}>Class Design & Relationships</h4>
              <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}>
                <pre style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--accent)',
                  lineHeight: '1.4',
                  whiteSpace: 'pre',
                  overflowX: 'auto'
                }}>
                  {selectedTopic.umlStructure}
                </pre>
              </div>
            </div>
          )}

          {/* Code Comparison Tab */}
          {activeSubTab === 'comparison' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600 }}>Refactoring Code Implementation</h4>
              
              <div style={{ display: 'grid', gridTemplateRows: 'auto auto', gap: '20px' }}>
                
                {/* Before: Violation */}
                <div className="glass-card" style={{ border: '1px solid rgba(239, 68, 68, 0.25)', overflow: 'hidden' }}>
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--hard)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={14} /> BAD PRACTICE (Violation)
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Legacy Logic / Coupled Code</span>
                  </div>
                  
                  <pre style={{
                    margin: 0,
                    background: 'rgba(0,0,0,0.4)',
                    padding: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: '#f87171',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto'
                  }}>
                    <code>{selectedTopic.beforeCode}</code>
                  </pre>
                </div>

                {/* After: Compliant */}
                <div className="glass-card" style={{ border: '1px solid rgba(16, 185, 129, 0.25)', overflow: 'hidden' }}>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--easy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} /> REFACTORED / COMPLIANT
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Clean Design / Decoupled Code</span>
                  </div>
                  
                  <pre style={{
                    margin: 0,
                    background: 'rgba(0,0,0,0.4)',
                    padding: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: '#34d399',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto'
                  }}>
                    <code>{selectedTopic.afterCode}</code>
                  </pre>
                </div>

              </div>
            </div>
          )}

          {/* Trade-offs Tab */}
          {activeSubTab === 'tradeoffs' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'white', fontWeight: 600 }}>Design Trade-offs & Evaluation</h4>
              <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <HelpCircle size={18} color="var(--medium)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'white', display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Architectural Impact & Constraints</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {selectedTopic.tradeoffs}
                    </p>
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
