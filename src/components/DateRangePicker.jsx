import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Monday-first: 0 = Mon … 6 = Sun
function firstDayOffset(year, month) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function formatDisplay(from, to) {
  if (!from && !to) return 'Select date range';
  const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  if (from && !to) return fmt(from);
  return `${fmt(from)}  –  ${fmt(to)}`;
}

export default function DateRangePicker({ from = '', to = '', onChange, label }) {
  const today = new Date().toISOString().split('T')[0];
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => from ? parseInt(from) : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => from ? parseInt(from.split('-')[1]) - 1 : new Date().getMonth());
  const [tempFrom, setTempFrom] = useState(from);
  const [tempTo, setTempTo] = useState(to);
  const ref = useRef(null);

  // Sync external changes
  useEffect(() => { setTempFrom(from); setTempTo(to); }, [from, to]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDay = (dateStr) => {
    // If no start, or both already set → start fresh
    if (!tempFrom || (tempFrom && tempTo)) {
      setTempFrom(dateStr);
      setTempTo('');
    } else {
      // Second click: order correctly
      if (dateStr < tempFrom) { setTempTo(tempFrom); setTempFrom(dateStr); }
      else { setTempTo(dateStr); }
    }
  };

  const handleDone = () => { onChange(tempFrom, tempTo); setOpen(false); };

  const handleClear = (e) => {
    e.stopPropagation();
    setTempFrom(''); setTempTo('');
    onChange('', '');
    setOpen(false);
  };

  // Build grid cells (always 6 rows × 7 = 42 cells)
  const offset = firstDayOffset(viewYear, viewMonth);
  const total = daysInMonth(viewYear, viewMonth);
  const prevTotal = daysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);

  const cells = [];
  for (let i = offset - 1; i >= 0; i--) {
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day: prevTotal - i, month: m, year: y, faded: true });
  }
  for (let d = 1; d <= total; d++) cells.push({ day: d, month: viewMonth, year: viewYear, faded: false });
  while (cells.length < 42) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({ day: cells.length - offset - total + 1, month: m, year: y, faded: true });
  }

  const hasValue = from || to;

  return (
    <div ref={ref} className="relative flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-400">{label}</label>}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm bg-gray-800 border border-white/[0.08] text-left transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/[0.15] w-full"
      >
        <Calendar size={14} style={{ color: '#6F6F6F' }} className="shrink-0" />
        <span className={`flex-1 truncate text-sm ${hasValue ? 'text-gray-200' : 'text-gray-500'}`}>
          {formatDisplay(from, to)}
        </span>
        {hasValue && (
          <X size={12} style={{ color: '#6F6F6F' }} className="shrink-0 hover:text-white transition-colors" onClick={handleClear} />
        )}
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 z-[60] w-[320px] bg-[#111111] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">

          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-semibold text-gray-100 tracking-tight">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-4 pt-3 pb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-medium text-gray-600">{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 px-4 pb-3">
            {cells.map((cell, i) => {
              const ds = toDateStr(cell.year, cell.month, cell.day);
              const isStart = ds === tempFrom;
              const isEnd = ds === tempTo;
              const inRange = tempFrom && tempTo && ds > tempFrom && ds < tempTo;
              const isToday = ds === today;
              const isStartEdge = isStart && tempTo;
              const isEndEdge = isEnd && tempFrom;

              return (
                <div key={i} className="relative flex items-center justify-center h-9">
                  {/* Range fill */}
                  {(inRange || isStartEdge || isEndEdge) && (
                    <div className={`absolute inset-y-1 bg-white/[0.07] ${
                      isStartEdge ? 'left-1/2 right-0' :
                      isEndEdge   ? 'left-0 right-1/2' :
                      'left-0 right-0'
                    }`} />
                  )}

                  <button
                    type="button"
                    disabled={cell.faded}
                    onClick={() => !cell.faded && handleDay(ds)}
                    className={`
                      relative z-10 w-8 h-8 rounded-full text-[13px] font-medium transition-colors
                      ${cell.faded ? 'text-gray-700 cursor-default' : 'cursor-pointer'}
                      ${isStart || isEnd ? 'bg-white text-gray-950 font-semibold' : ''}
                      ${!isStart && !isEnd && !cell.faded ? 'text-gray-300 hover:bg-white/[0.09]' : ''}
                    `}
                  >
                    {cell.day}
                    {isToday && !isStart && !isEnd && !cell.faded && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-500" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Done */}
          <div className="px-4 pb-4 pt-1 border-t border-white/[0.05]">
            <button
              onClick={handleDone}
              className="w-full py-3 rounded-xl bg-white text-gray-950 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
