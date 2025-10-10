import React, { useState } from 'react';
import './DateTimeSelection.css';

const DateTimeSelection = ({ availableSlots, onSelectDateTime, selectedDate, selectedTime }) => {
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime);

  const handleTimeSelect = (time) => {
    setLocalSelectedTime(time);
    onSelectDateTime(selectedDate, time);
  };

  const getAvailableTimes = () => {
    if (!availableSlots || availableSlots.length === 0) {
      return [];
    }
    // The API returns slots as objects with startTime and endTime
    return availableSlots
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="datetime-selection">
        <h3>Выберите дату и время</h3>
        <div className="no-slots">
          <p>Нет доступных слотов. Попробуйте выбрать другую дату или свяжитесь с бизнесом напрямую.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="datetime-selection">
      <h3>Выберите время</h3>
      <p className="section-description">Выберите удобное время записи</p>
      
      <div className="time-selection">
        <div className="times-grid">
          {getAvailableTimes().map(timeSlot => (
            <button
              key={timeSlot.startTime}
              className={`time-btn ${localSelectedTime === timeSlot.startTime ? 'selected' : ''}`}
              onClick={() => handleTimeSelect(timeSlot.startTime)}
            >
              {timeSlot.startTime}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
