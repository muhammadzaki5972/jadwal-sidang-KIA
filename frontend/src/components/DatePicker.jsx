import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const DatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const handleDateSelect = (day) => {
    // Format to YYYY-MM-DD for standard html input compatibility
    onChange(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const displayValue = value ? format(new Date(value), 'dd/MM/yyyy') : 'dd/mm/yyyy';
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
        <CalendarIcon className="w-4 h-4 text-slate-500" />
      </div>
      <input
        type="text"
        readOnly
        required
        className="input input-bordered w-full pe-10 cursor-pointer"
        value={displayValue}
        onClick={() => setIsOpen(!isOpen)}
      />
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-72 bg-base-100 rounded-box shadow-xl border border-base-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={prevMonth} className="btn btn-ghost btn-sm btn-circle">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-base-content capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: idLocale })}
            </h2>
            <button type="button" onClick={nextMonth} className="btn btn-ghost btn-sm btn-circle">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center font-semibold text-base-content/60 text-xs py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`
                    btn btn-sm btn-circle mx-auto
                    ${!isCurrentMonth ? 'btn-ghost text-base-content/30' : ''}
                    ${isSelected ? 'btn-primary' : isCurrentMonth ? 'btn-ghost' : ''}
                    ${isToday && !isSelected ? 'border-primary text-primary' : ''}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
