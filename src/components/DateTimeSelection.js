import React, { useState } from 'react';
import './DateTimeSelection.css';
import Calendar from './Calendar';

const DateTimeSelection = ({ availableSlots, onSelectDateTime, selectedDate, selectedTime }) => {
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime);
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);

  const handleDateSelect = (date) => {
    setLocalSelectedDate(date);
    onSelectDateTime(date, localSelectedTime);
  };

  const handleTimeSelect = (time) => {
    setLocalSelectedTime(time);
    onSelectDateTime(localSelectedDate, time);
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
      <h3>Выберите дату и время</h3>
      <p className="section-description">Выберите удобную дату и время записи</p>
      
      <div className="date-selection">
        <h4>Выберите дату</h4>
        <Calendar
          selectedDate={localSelectedDate}
          onDateSelect={handleDateSelect}
          availableDates={[]} // You can pass available dates here if needed
        />
      </div>
      
      {localSelectedDate && (
        <div className="time-selection">
          <h4>Выберите время</h4>
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
      )}
    </div>
  );
};

export default DateTimeSelection;
