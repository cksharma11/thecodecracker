import React from 'react';
import { LayoutDashboard, Code2, Map, Activity, Milestone } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, solvedCount, totalCount }) {
  const percent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: Code2 },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'visualizer', label: 'Visualizer', icon: Activity },
  ];

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderRadius: '0 0 12px 12px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
    }}>
      {/* Logo */}
      <div 
        onClick={() => setActiveTab('dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '1.25rem',
          letterSpacing: '-0.02em',
        }}
        className="font-display"
      >
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)',
        }}>
          <Milestone size={18} color="white" />
        </div>
        <span>Leet<span className="text-gradient">DSA</span></span>
        <span style={{
          fontSize: '0.65rem',
          background: 'rgba(255,255,255,0.06)',
          padding: '2px 6px',
          borderRadius: '4px',
          color: 'var(--text-secondary)',
          fontWeight: 500,
          border: '1px solid var(--border-color)',
        }}>101 Arena</span>
      </div>

      {/* Nav Menu */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid transparent',
                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                borderColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
              }}
              className="nav-link"
            >
              <Icon size={16} />
              <span className="nav-label" style={{ display: 'inline' }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress Widget */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Arena Progress</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {solvedCount} <span style={{ color: 'var(--text-muted)' }}>/ {totalCount} Solved</span>
          </div>
        </div>
        
        {/* Progress Circle (SVG) */}
        <div style={{ position: 'relative', width: '38px', height: '38px' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '38px', height: '38px' }}>
            <circle
              cx="19"
              cy="19"
              r="16"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="3.5"
              fill="transparent"
            />
            <circle
              cx="19"
              cy="19"
              r="16"
              stroke="var(--accent)"
              strokeWidth="3.5"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 16}
              strokeDashoffset={2 * Math.PI * 16 * (1 - percent / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}>
            {percent}%
          </div>
        </div>
      </div>
    </nav>
  );
}
