import React from 'react';

export default function Heatmap({ submissions }) {
  // Generate date array for the last 365 days (53 weeks)
  const getPastYearDays = () => {
    const days = [];
    const today = new Date();
    
    // We want the grid to end on today (placed at the bottom right)
    // To align weeks, let's find the Sunday 52 weeks ago
    const startOffset = today.getDay(); // 0 = Sun, 1 = Mon, etc.
    const totalDays = 364 + startOffset; // 52 weeks * 7 days = 364
    
    for (let i = totalDays; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const days = getPastYearDays();

  // Aggregate submissions by date string (YYYY-MM-DD)
  const submissionCounts = {};
  submissions.forEach((sub) => {
    if (sub.status === 'SUCCESS' || sub.status === 'PASSED') {
      const dateStr = new Date(sub.timestamp).toISOString().split('T')[0];
      submissionCounts[dateStr] = (submissionCounts[dateStr] || 0) + 1;
    }
  });

  // Group days into weeks of 7 days
  const weeks = [];
  let currentWeek = [];

  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getIntensityClass = (count) => {
    if (!count) return 'heatmap-lvl-0';
    if (count === 1) return 'heatmap-lvl-1';
    if (count === 2) return 'heatmap-lvl-2';
    if (count === 3) return 'heatmap-lvl-3';
    return 'heatmap-lvl-4';
  };

  const formatDateLabel = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Determine positions of month labels along the top of the grid
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstDay = week[0];
    if (firstDay && firstDay.getMonth() !== lastMonth) {
      monthLabels.push({
        label: monthNames[firstDay.getMonth()],
        index: weekIndex
      });
      lastMonth = firstDay.getMonth();
    }
  });

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
        Submissions Calendar
      </h3>

      <div className="heatmap-container" style={{ position: 'relative' }}>
        {/* Month Labels */}
        <div style={{
          display: 'flex',
          marginLeft: '32px',
          height: '20px',
          fontSize: '0.7rem',
          color: 'var(--text-secondary)',
          position: 'relative'
        }}>
          {monthLabels.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                position: 'absolute',
                left: `${m.index * 17}px`,
                whiteSpace: 'nowrap'
              }}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Weekday Labels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '116px',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            width: '24px',
            textAlign: 'right',
            paddingRight: '4px',
            paddingTop: '2px'
          }}>
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          {/* Grid Blocks */}
          <div style={{ display: 'flex', gap: '3px' }}>
            {weeks.map((week, weekIdx) => (
              <div 
                key={weekIdx} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '3px' 
                }}
              >
                {/* Pad the first week if it starts mid-week */}
                {weekIdx === 0 && week.length < 7 && 
                  Array.from({ length: 7 - week.length }).map((_, i) => (
                    <div 
                      key={`pad-${i}`} 
                      style={{ 
                        width: '14px', 
                        height: '14px', 
                        opacity: 0 
                      }} 
                    />
                  ))
                }
                
                {week.map((day, dayIdx) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const count = submissionCounts[dateStr] || 0;
                  const intensityClass = getIntensityClass(count);
                  
                  return (
                    <div
                      key={dateStr}
                      className={`heatmap-cell ${intensityClass}`}
                      data-tooltip={`${count} problem${count !== 1 ? 's' : ''} solved on ${formatDateLabel(day)}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.7rem',
        color: 'var(--text-secondary)',
        marginTop: '12px'
      }}>
        <span>Less</span>
        <div className="heatmap-cell heatmap-lvl-0" style={{ cursor: 'default' }} />
        <div className="heatmap-cell heatmap-lvl-1" style={{ cursor: 'default' }} />
        <div className="heatmap-cell heatmap-lvl-2" style={{ cursor: 'default' }} />
        <div className="heatmap-cell heatmap-lvl-3" style={{ cursor: 'default' }} />
        <div className="heatmap-cell heatmap-lvl-4" style={{ cursor: 'default' }} />
        <span>More</span>
      </div>
    </div>
  );
}
