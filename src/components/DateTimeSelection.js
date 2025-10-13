import React, { useState } from 'react';
import './DateTimeSelection.css';
import Calendar from './Calendar';

const DateTimeSelection = ({ availableSlots, onSelectDateTime, selectedDate, selectedTime }) => {
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime);
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);
  const [showAllSlots, setShowAllSlots] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDateSelect = (date) => {
    setLocalSelectedDate(date);
    setLocalSelectedTime(null); // Reset time when date changes
    setShowAllSlots(true); // Show all slots for new date
    onSelectDateTime(date, null);
  };

  const handleTimeSelect = (time) => {
    setLocalSelectedTime(time);
    setShowAllSlots(false); // Hide other slots when one is selected
    setIsCollapsed(true); // Collapse the entire component after time selection
    onSelectDateTime(localSelectedDate, time);
  };

  const handleChangeTime = () => {
    setShowAllSlots(true); // Show all slots again
    setIsCollapsed(false); // Expand the component to show calendar again
  };

  const handleChangeDateTime = () => {
    setIsCollapsed(false);
    setShowAllSlots(true);
  };

  const getAvailableTimes = () => {
    if (!availableSlots || availableSlots.length === 0) {
      return [];
    }
    // The API returns slots as objects with startTime and endTime
    return availableSlots
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('ru-RU', options);
    } catch (error) {
      return dateString;
    }
  };

  // Only show "no slots" message if a date is selected but no slots are available
  if (localSelectedDate && (!availableSlots || availableSlots.length === 0)) {
    return (
      <div className="datetime-selection">
        <h3>Выберите дату и время</h3>
        <p className="section-description">Выберите удобную дату и время записи</p>
        
        <div className="date-selection">
          <h4>Выберите дату</h4>
          <Calendar
            selectedDate={localSelectedDate}
            onDateSelect={handleDateSelect}
            availableDates={[]}
          />
        </div>
        
        <div className="no-slots">
          <p>Нет доступных слотов на выбранную дату. Попробуйте выбрать другую дату или свяжитесь с бизнесом напрямую.</p>
        </div>
      </div>
    );
  }

  // Show collapsed view when both date and time are selected
  if (isCollapsed && localSelectedDate && localSelectedTime) {
    return (
      <div className="datetime-selection">
        <div className="section-header">
          <div className="section-title">
            <h3>Выберите дату и время</h3>
            <button className="change-btn" onClick={handleChangeDateTime}>
              Изменить
            </button>
          </div>
          <p className="section-description">Выберите удобную дату и время записи</p>
        </div>

        <div className="selected-datetime-display">
          <div className="selected-datetime-item">
            <div className="datetime-icon">📅</div>
            <div className="datetime-content">
              <h4>Дата и время</h4>
              <div className="datetime-details">
                <span className="selected-date">{formatDate(localSelectedDate)}</span>
                <span className="selected-time">{localSelectedTime}</span>
              </div>
            </div>
            <div className="selection-checkmark">✓</div>
          </div>
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
          <div className="time-selection-header">
            <h4>Выберите время</h4>
            {localSelectedTime && !showAllSlots && (
              <button className="change-time-btn" onClick={handleChangeTime}>
                Изменить
              </button>
            )}
          </div>
          
          {showAllSlots ? (
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
          ) : (
            localSelectedTime && (
              <div className="selected-time-display">
                <div className="selected-time-card">
                  <span className="selected-time-text">{localSelectedTime}</span>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
