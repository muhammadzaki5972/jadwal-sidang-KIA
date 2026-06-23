import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

const TimePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const currentHour = value ? value.split(':')[0] : '00';
  const currentMinute = value ? value.split(':')[1] : '00';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHourSelect = (hour) => {
    onChange(`${hour}:${currentMinute}`);
  };

  const handleMinuteSelect = (minute) => {
    onChange(`${currentHour}:${minute}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
        <Clock className="w-4 h-4 text-slate-500" />
      </div>
      <input
        type="text"
        readOnly
        required
        className="input input-bordered w-full pe-10 cursor-pointer"
        value={value || '--:--'}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-base-100 rounded-box shadow-xl border border-base-200 p-2">
          <div className="flex justify-between gap-2">
            <div className="flex-1">
              <div className="text-center text-xs font-bold text-base-content/60 mb-2">Jam</div>
              <ul className="h-48 overflow-y-auto custom-scrollbar pr-1">
                {hours.map(h => (
                  <li key={h}>
                    <button
                      type="button"
                      onClick={() => handleHourSelect(h)}
                      className={`btn btn-sm w-full ${currentHour === h ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {h}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <div className="text-center text-xs font-bold text-base-content/60 mb-2">Menit</div>
              <ul className="h-48 overflow-y-auto custom-scrollbar pr-1">
                {minutes.map(m => (
                  <li key={m}>
                    <button
                      type="button"
                      onClick={() => handleMinuteSelect(m)}
                      className={`btn btn-sm w-full ${currentMinute === m ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {m}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
