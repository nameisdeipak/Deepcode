import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const ContributionGraph = ({ submission }) => {
  const { theme } = useSelector(state => state.auth);


  const graphRef = useRef(null);


  const [tooltip, setTooltip] = useState({
    visible: false,
    content: '',
    x: 0,
    y: 0,
  });


  const CELL_WIDTH = 10;
  const REGULAR_GAP = 2;
  const MONTH_GAP = 8;

  
  const totalSubmissions = submission?.map((item, index) => item.count).reduce((acc, curr) => acc + curr, 0);
  const totalActiveDays = submission?.length;
  const dataMap = new Map(submission?.map(s => [s.date, s.count]));

  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const calendarStartDate = new Date(startDate);
  calendarStartDate.setDate(calendarStartDate.getDate() - calendarStartDate.getDay());

  const monthLabels = [];
  const monthStartWeeks = new Set();
  const seenMonthKeys = new Set();

  for (let i = 0; i < 53; i++) {
    for (let j = 0; j < 7; j++) {
      const cellDate = new Date(calendarStartDate);
      cellDate.setDate(cellDate.getDate() + i * 7 + j);

      if (cellDate >= startDate && cellDate <= endDate) {
        const monthName = cellDate.toLocaleString('default', { month: 'short' });
        const year = cellDate.getFullYear();
        const monthKey = `${monthName}-${year}`;

        if (!seenMonthKeys.has(monthKey)) {
          seenMonthKeys.add(monthKey);
          monthLabels.push({ label: monthName, weekIndex: i });
          if (i > 0) {
            monthStartWeeks.add(i);
          }
          break;
        }
      }
    }
  }

  let currentOffset = 0;
  const columnOffsets = Array(53).fill(0).map((_, index) => {
    if (monthStartWeeks.has(index)) {
      currentOffset += MONTH_GAP;
    }
    const offset = currentOffset;
    currentOffset += CELL_WIDTH + REGULAR_GAP;
    return offset;
  });

  
  const handleMouseEnter = (e, content) => {
    const graphEl = graphRef.current;
    if (!graphEl) return;

    const cellRect = e.currentTarget.getBoundingClientRect();
    const graphRect = graphEl.getBoundingClientRect();

    
    const x = cellRect.left - graphRect.left + cellRect.width / 2;
    const y = cellRect.top - graphRect.top;

    setTooltip({
      visible: true,
      content: content,
      x: x,
      y: y,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (

    <div
      ref={graphRef}
      className={`${theme === 'dark' ? 'bg-gray-100/5 text-gray-300' : 'bg-white text-black'} relative w-full shadow p-6 rounded-lg max-w-max mx-auto my-8 font-sans`}
    >

      <div className="flex justify-between flex-col md:flex-row items-center mb-4">
        <h2 className="text-base font-semibold">
          {totalSubmissions} submissions in the last year
        </h2>
        <div className="text-sm text-gray-400">
          <span className="mr-4">Total active days: {totalActiveDays}</span>
        </div>
      </div>

      
      {tooltip.visible && (
        <div
          className="absolute z-50 px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 rounded-md shadow-lg pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            
            transform: 'translate(-50%, -125%)',
          }}
        >
          {tooltip.content}
        </div>
      )}

      <div className="pt-8 p-2 overflow-x-scroll h-full w-full">
        <div className="flex gap-1">
          <div className='relative w-full'>
            {monthLabels.map(({ label, weekIndex }) => (
              <div
                key={`${label}-${weekIndex}`}
                className="absolute top-[-25px] text-center w-full text-xs text-gray-400"
                style={{ left: `${columnOffsets[weekIndex]}px` }}
              >
                {label}
              </div>
            ))}
          </div>

          {Array(53).fill(0).map((_, weekIndex) => (
            <div
              key={weekIndex}
              className={`flex flex-col gap-1 ${monthStartWeeks.has(weekIndex) ? 'ml-2' : ''}`}
            >
              {Array(7).fill(0).map((_, dayIndex) => {
                const cellDate = new Date(calendarStartDate);
                cellDate.setDate(cellDate.getDate() + weekIndex * 7 + dayIndex);
                const isDateInRange = cellDate >= startDate && cellDate <= endDate;
                
                if (!isDateInRange) {
                  
                  return <div key={dayIndex} className="w-2 h-2" />; 
                }

                const dateString = cellDate.toISOString().split('T')[0];
                const count = dataMap.get(dateString) || 0;

                let bgColorClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
                let tooltipText = `0 submissions on ${cellDate.toDateString()}`;

                if (count > 0) {
                  tooltipText = `${count} submission${count > 1 ? 's' : ''} on ${cellDate.toDateString()}`;
                  if (count <= 2) bgColorClass = 'bg-[#145333]';
                  else if (count <= 4) bgColorClass = 'bg-[#006d32]';
                  else if (count <= 6) bgColorClass = 'bg-[#26a641]';
                  else bgColorClass = 'bg-[#39d353]';
                }

                return (
             
                  <div
                    key={dayIndex}
                    className={`w-2 h-2  ${bgColorClass} cursor-pointer`}
                    onMouseEnter={(e) => handleMouseEnter(e, tooltipText)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;


