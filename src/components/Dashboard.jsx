import React from 'react';
import Heatmap from './Heatmap';
import { Award, Flame, Zap, Compass, ArrowRight } from 'lucide-react';

export default function Dashboard({ problems, solvedIds, submissions, setActiveTab, setSelectedProblem }) {
  // Count solved problems by difficulty
  const counts = {
    total: problems.length,
    solved: solvedIds.size,
    easy: { total: 0, solved: 0 },
    medium: { total: 0, solved: 0 },
    hard: { total: 0, solved: 0 }
  };

  problems.forEach(p => {
    const diffKey = p.difficulty.toLowerCase();
    counts[diffKey].total += 1;
    if (solvedIds.has(p.id)) {
      counts[diffKey].solved += 1;
    }
  });

  // Calculate current streak
  const calculateStreak = () => {
    const dates = new Set();
    submissions.forEach(sub => {
      if (sub.status === 'SUCCESS' || sub.status === 'PASSED') {
        const dateStr = new Date(sub.timestamp).toISOString().split('T')[0];
        dates.add(dateStr);
      }
    });

    if (dates.size === 0) return 0;

    let streak = 0;
    const today = new Date();
    const checkDate = new Date(today);

    // If no submissions today, check if there was one yesterday
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (!dates.has(todayStr) && !dates.has(yesterdayStr)) {
      return 0; // Streak broken
    }

    // Start checking from the most recent active day
    if (!dates.has(todayStr)) {
      checkDate.setDate(today.getDate() - 1);
    }

    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (dates.has(checkStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  // Categories list and completion percentage
  const categoriesMap = {};
  problems.forEach(p => {
    if (!categoriesMap[p.category]) {
      categoriesMap[p.category] = { total: 0, solved: 0 };
    }
    categoriesMap[p.category].total += 1;
    if (solvedIds.has(p.id)) {
      categoriesMap[p.category].solved += 1;
    }
  });

  const categories = Object.entries(categoriesMap).map(([name, stat]) => ({
    name,
    percent: Math.round((stat.solved / stat.total) * 100),
    solved: stat.solved,
    total: stat.total
  })).sort((a, b) => b.percent - a.percent);

  // Recommendation: Find the first unsolved problem
  const recommendedProblem = problems.find(p => !solvedIds.has(p.id));

  const startProblem = (problem) => {
    setSelectedProblem(problem);
    setActiveTab('problems');
  };

  const renderDoughnut = (title, solved, total, color) => {
    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
    const r = 24;
    const circ = 2 * Math.PI * r;
    const strokeOffset = circ * (1 - percent / 100);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative', width: '56px', height: '56px' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '56px', height: '56px' }}>
            <circle
              cx="28"
              cy="28"
              r={r}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r={r}
              stroke={color}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circ}
              strokeDashoffset={strokeOffset}
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
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}>
            {percent}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{solved}/{total}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(17, 24, 39, 0.8) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ flex: '1 1 400px' }}>
          <h1 className="font-display text-gradient" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
            Welcome to LeetDSA Arena!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
            Accelerate your learning through 101 handpicked algorithmic challenges. Write, test, and visualize code in your browser with session state stored offline.
          </p>
        </div>

        {/* Streaks & Badges */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <Flame size={20} color="var(--hard)" />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Streak</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{streak} Day{streak !== 1 ? 's' : ''}</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <Award size={20} color="var(--easy)" />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Solved</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{counts.solved} / {counts.total}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        
        {/* Left Side Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Submissions Heatmap */}
          <Heatmap submissions={submissions} />

          {/* Recommended Next Problem */}
          {recommendedProblem ? (
            <div className="glass-panel" style={{
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(99, 102, 241, 0.03)',
              border: '1px solid rgba(99, 102, 241, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Compass size={22} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>RECOMMENDED NEXT TASK</div>
                  <h4 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Problem #{recommendedProblem.id}: {recommendedProblem.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                    <span className={`badge badge-${recommendedProblem.difficulty.toLowerCase()}`}>
                      {recommendedProblem.difficulty}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      in {recommendedProblem.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => startProblem(recommendedProblem)}
                className="btn-primary"
              >
                Solve Challenge <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="glass-panel" style={{
              padding: '24px',
              textAlign: 'center',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <Award size={36} color="var(--easy)" style={{ marginBottom: '8px' }} />
              <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Congratulations! You solved all 101 problems!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                You have forged a deep expertise in Data Structures & Algorithms. Try optimizing your solutions!
              </p>
            </div>
          )}
        </div>

        {/* Right Side Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Difficulty Ratios */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--text-primary)' }}>
              Solved by Difficulty
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '12px' }}>
              {renderDoughnut('Easy', counts.easy.solved, counts.easy.total, 'var(--easy)')}
              {renderDoughnut('Medium', counts.medium.solved, counts.medium.total, 'var(--medium)')}
              {renderDoughnut('Hard', counts.hard.solved, counts.hard.total, 'var(--hard)')}
            </div>
          </div>

          {/* Category Progress */}
          <div className="glass-panel" style={{ padding: '24px', flexGrow: 1 }}>
            <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
              Solved by Category
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categories.map(cat => (
                <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cat.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {cat.solved}/{cat.total} ({cat.percent}%)
                    </span>
                  </div>
                  
                  {/* Progress Line */}
                  <div style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.03)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${cat.percent}%`,
                      height: '100%',
                      background: cat.percent === 100 
                        ? 'linear-gradient(90deg, var(--easy) 0%, #059669 100%)'
                        : 'linear-gradient(90deg, var(--accent) 0%, #4f46e5 100%)',
                      borderRadius: '3px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
