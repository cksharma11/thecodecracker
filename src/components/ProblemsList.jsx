import React, { useState } from 'react';
import { Search, CheckCircle2, Bookmark, Filter, RefreshCw, Star } from 'lucide-react';

export default function ProblemsList({ problems, solvedIds, attemptedIds, bookmarks, toggleBookmark, setSelectedProblem, setActiveTab }) {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');

  // Collect unique categories & companies
  const categories = ['All', ...new Set(problems.map(p => p.category))];
  
  const allCompanies = new Set();
  problems.forEach(p => p.companyTags && p.companyTags.forEach(c => allCompanies.add(c)));
  const companies = ['All', ...Array.from(allCompanies).sort()];

  // Filter list
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase()) ||
                          p.id.toString() === search;

    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'Solved') matchesStatus = solvedIds.has(p.id);
    else if (statusFilter === 'Attempted') matchesStatus = attemptedIds.has(p.id) && !solvedIds.has(p.id);
    else if (statusFilter === 'Todo') matchesStatus = !solvedIds.has(p.id);

    const matchesCompany = selectedCompany === 'All' || (p.companyTags && p.companyTags.includes(selectedCompany));

    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus && matchesCompany;
  });

  const getStatusIcon = (id) => {
    if (solvedIds.has(id)) {
      return <CheckCircle2 size={18} color="var(--easy)" style={{ fill: 'rgba(16, 185, 129, 0.1)' }} />;
    }
    if (attemptedIds.has(id)) {
      return <RefreshCw size={18} color="var(--medium)" />;
    }
    return <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px dashed var(--text-muted)' }} />;
  };

  const getDifficultyColorClass = (diff) => {
    if (diff === 'Easy') return 'badge-easy';
    if (diff === 'Medium') return 'badge-medium';
    return 'badge-hard';
  };

  const selectProblem = (problem) => {
    setSelectedProblem(problem);
    setActiveTab('workspace');
  };

  const clearFilters = () => {
    setSearch('');
    setDifficultyFilter('All');
    setCategoryFilter('All');
    setStatusFilter('All');
    setSelectedCompany('All');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ marginBottom: '4px' }}>
        <h1 className="font-display text-gradient" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Data Structures & Algorithms Practice
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Select from 101 handpicked programming challenges to build your problem-solving foundations.
        </p>
      </div>
      
      {/* Filters Panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Search & Basic Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          
          {/* Search bar */}
          <div style={{
            position: 'relative',
            flex: '1 1 280px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              placeholder="Search problem title, keyword, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.9rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          {/* Difficulty Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="All">All Categories</option>
              {categories.slice(1).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Todo">Todo (Unsolved)</option>
              <option value="Attempted">Attempted</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(search || difficultyFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'All' || selectedCompany !== 'All') && (
            <button
              onClick={clearFilters}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Reset Filters
            </button>
          )}

        </div>

        {/* Company Tags Filtering */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Company tags:</span>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', maxWidth: 'calc(100% - 100px)' }}>
            {companies.slice(0, 10).map(c => (
              <button
                key={c}
                onClick={() => setSelectedCompany(c)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  border: '1px solid',
                  background: selectedCompany === c ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  borderColor: selectedCompany === c ? 'var(--accent)' : 'var(--border-color)',
                  color: selectedCompany === c ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {c === 'All' ? 'All Companies' : c}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Problems Count Alert */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <div>
          Showing <strong>{filteredProblems.length}</strong> of <strong>{problems.length}</strong> problems
        </div>
      </div>

      {/* Problems Table Grid */}
      <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border-color)',
              background: 'rgba(17, 24, 39, 0.5)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              letterSpacing: '0.05em'
            }}>
              <th style={{ padding: '16px 20px', width: '60px' }}>Status</th>
              <th style={{ padding: '16px 20px', width: '80px' }}>ID</th>
              <th style={{ padding: '16px 20px' }}>Title</th>
              <th style={{ padding: '16px 20px', width: '160px' }}>Category</th>
              <th style={{ padding: '16px 20px', width: '100px' }}>Difficulty</th>
              <th style={{ padding: '16px 20px', width: '120px' }}>Company Tags</th>
              <th style={{ padding: '16px 20px', width: '60px', textAlign: 'center' }}>Save</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <tr
                  key={problem.id}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => selectProblem(problem)}
                >
                  <td style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center' }}>
                    {getStatusIcon(problem.id)}
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    #{problem.id}
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <span style={{ transition: 'color 0.15s ease' }}>{problem.title}</span>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {problem.category}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge ${getDifficultyColorClass(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {problem.companyTags && problem.companyTags.slice(0, 2).map(company => (
                        <span
                          key={company}
                          onClick={() => setSelectedCompany(company)}
                          style={{
                            fontSize: '0.65rem',
                            padding: '2px 6px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent)'}
                          onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        >
                          {company}
                        </span>
                      ))}
                      {problem.companyTags && problem.companyTags.length > 2 && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                          +{problem.companyTags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleBookmark(problem.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: bookmarks.has(problem.id) ? 'var(--medium)' : 'var(--text-muted)'
                      }}
                    >
                      <Star size={16} style={{ fill: bookmarks.has(problem.id) ? 'var(--medium)' : 'transparent' }} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No problems found matching search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
