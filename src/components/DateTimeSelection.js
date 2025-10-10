import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import './DateTimeSelection.css';

const DateTimeSelection = ({ availableSlots, onSelectDateTime, selectedDate, selectedTime, onTimeSlotSelected }) => {
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate || new Date());
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime);

  const handleDateSelect = (date) => {
    setLocalSelectedDate(date);
    // Clear time selection when date changes
    setLocalSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setLocalSelectedTime(time);
    onSelectDateTime(localSelectedDate, time);
    
    // Automatically navigate to appointment details after time selection
    if (onTimeSlotSelected) {
      setTimeout(() => {
        onTimeSlotSelected();
      }, 300); // Small delay for better UX
    }
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
      <p className="section-description">Выберите удобную дату и время для записи</p>
      
      <div className="date-selection">
        <Calendar
          selectedDate={localSelectedDate}
          onDateSelect={handleDateSelect}
          availableDates={availableSlots ? availableSlots.map(slot => slot.date) : []}
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
