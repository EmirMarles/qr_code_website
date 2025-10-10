import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ selectedDate, onDateSelect, availableDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const today = new Date();
  const currentDate = new Date();

  const isDateAvailable = (date) => {
    if (!availableDates || availableDates.length === 0) return true;
    
    const dateStr = date.toISOString().split('T')[0];
    return availableDates.some(availableDate => {
      const availableDateStr = new Date(availableDate).toISOString().split('T')[0];
      return availableDateStr === dateStr;
    });
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date) => {
    if (!isDateAvailable(date) || isPastDate(date)) return;
    onDateSelect(date);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const navigateYear = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(prev.getFullYear() + direction);
      return newMonth;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isAvailable = isDateAvailable(date);
      const isSelected = isDateSelected(date);
      const isTodayDate = isToday(date);
      const isPast = isPastDate(date);
      
      days.push(
        <button
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isTodayDate ? 'today' : ''} ${!isAvailable || isPast ? 'disabled' : ''}`}
          onClick={() => handleDateClick(date)}
          disabled={!isAvailable || isPast}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const renderYearView = () => {
    const years = [];
    const currentYear = currentMonth.getFullYear();
    
    for (let year = currentYear - 6; year <= currentYear + 5; year++) {
      years.push(
        <button
          key={year}
          className={`year-option ${year === currentYear ? 'selected' : ''}`}
          onClick={() => {
            setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
            setViewMode('month');
          }}
        >
          {year}
        </button>
      );
    }
    
    return years;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button 
            className="nav-btn"
            onClick={() => viewMode === 'month' ? navigateMonth(-1) : navigateYear(-1)}
          >
            ‹
          </button>
          
          <div className="calendar-title">
            {viewMode === 'month' ? (
              <button 
                className="month-year-btn"
                onClick={() => setViewMode('year')}
              >
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </button>
            ) : (
              <div className="year-title">{currentMonth.getFullYear()}</div>
            )}
          </div>
          
          <button 
            className="nav-btn"
            onClick={() => viewMode === 'month' ? navigateMonth(1) : navigateYear(1)}
          >
            ›
          </button>
        </div>
        
        <button className="today-btn" onClick={goToToday}>
          Сегодня
        </button>
      </div>

      {viewMode === 'month' ? (
        <>
          <div className="calendar-weekdays">
            {weekDays.map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="calendar-grid">
            {renderDays()}
          </div>
        </>
      ) : (
        <div className="year-grid">
          {renderYearView()}
        </div>
      )}
    </div>
  );
};

export default Calendar;
