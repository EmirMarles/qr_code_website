import React, { useState } from 'react';
import './DateTimeSelection.css';

const DateTimeSelection = ({ availableSlots, onSelectDateTime, selectedDate, selectedTime }) => {
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime);

  const handleDateSelect = (date) => {
    setLocalSelectedDate(date);
    setLocalSelectedTime(null); // Reset time selection
    onSelectDateTime(date, null);
  };

  const handleTimeSelect = (time) => {
    setLocalSelectedTime(time);
    onSelectDateTime(localSelectedDate, time);
  };

  const getAvailableDates = () => {
    if (!availableSlots || availableSlots.length === 0) {
      return [];
    }
    const dates = [...new Set(availableSlots.map(slot => slot.date))];
    return dates.sort();
  };

  const getAvailableTimes = (date) => {
    if (!availableSlots || availableSlots.length === 0) {
      return [];
    }
    return availableSlots
      .filter(slot => slot.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="datetime-selection">
        <h3>Select Date & Time</h3>
        <div className="no-slots">
          <p>No available time slots found. Please try selecting a different date or contact the business directly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="datetime-selection">
      <h3>Select Date & Time</h3>
      <p className="section-description">Choose your preferred date and time</p>
      
      <div className="date-selection">
        <h4>Choose Date</h4>
        <div className="dates-grid">
          {getAvailableDates().map(date => (
            <button
              key={date}
              className={`date-btn ${localSelectedDate === date ? 'selected' : ''}`}
              onClick={() => handleDateSelect(date)}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {localSelectedDate && (
        <div className="time-selection">
          <h4>Choose Time</h4>
          <div className="times-grid">
            {getAvailableTimes(localSelectedDate).map(timeSlot => (
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
