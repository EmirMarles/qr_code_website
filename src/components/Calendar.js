import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ selectedDate, onDateSelect, availableDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(selectedDate ? new Date(selectedDate) : null);

  useEffect(() => {
    if (selectedDate) {
      setSelectedDay(new Date(selectedDate));
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getMonthName = (date) => {
    const russianMonths = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return russianMonths[date.getMonth()];
  };

  const getYear = (date) => {
    return date.getFullYear();
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    
    // If no available dates specified, allow all future dates
    if (availableDates.length === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }

    // Check if date is in available dates
    const dateString = date.toISOString().split('T')[0];
    return availableDates.includes(dateString);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDay) return false;
    return date.toDateString() === selectedDay.toDateString();
  };

  const handleDateClick = (date) => {
    if (!date || !isDateAvailable(date)) return;
    
    setSelectedDay(date);
    onDateSelect(date);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    if (isDateAvailable(today)) {
      setSelectedDay(today);
      onDateSelect(today);
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-btn" onClick={goToPreviousMonth}>
          ‹
        </button>
        <div className="month-year">
          <h3>{getMonthName(currentMonth)} {getYear(currentMonth)}</h3>
        </div>
        <button className="nav-btn" onClick={goToNextMonth}>
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        <div className="weekday">Пн</div>
        <div className="weekday">Вт</div>
        <div className="weekday">Ср</div>
        <div className="weekday">Чт</div>
        <div className="weekday">Пт</div>
        <div className="weekday">Сб</div>
        <div className="weekday">Вс</div>
      </div>

      <div className="calendar-days">
        {days.map((day, index) => {
          const available = isDateAvailable(day);
          const today = isToday(day);
          const selected = isSelected(day);

          return (
            <button
              key={index}
              className={`calendar-day ${available ? 'available' : ''} ${today ? 'today' : ''} ${selected ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}
              disabled={!available}
            >
              {day ? day.getDate() : ''}
            </button>
          );
        })}
      </div>

      <div className="calendar-footer">
        <button className="today-btn" onClick={goToToday}>
          Сегодня
        </button>
      </div>
    </div>
  );
};

export default Calendar;
