import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { fetchAvailableSlots } from '../services/api';
import './DateTimeSelection.css';

const DateTimeSelection = ({ availableSlots, onSelectDateTime, selectedDate, selectedTime, onTimeSlotSelected, businessId, selectedStaff, selectedService }) => {
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate || new Date());
  const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const handleDateSelect = async (date) => {
    setLocalSelectedDate(date);
    // Clear time selection when date changes
    setLocalSelectedTime(null);
    
    // Fetch available time slots for the selected date
    if (businessId && selectedStaff && selectedService) {
      setLoadingSlots(true);
      try {
        const dateStr = date.toISOString().split('T')[0];
        const slots = await fetchAvailableSlots(businessId, selectedStaff._id, selectedService._id, dateStr);
        setTimeSlots(slots);
      } catch (error) {
        console.error('Failed to fetch time slots:', error);
        setTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
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
    if (!timeSlots || timeSlots.length === 0) {
      return [];
    }
    // The API returns slots as objects with startTime and endTime
    return timeSlots
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Load initial time slots when component mounts
  useEffect(() => {
    if (localSelectedDate && businessId && selectedStaff && selectedService) {
      handleDateSelect(localSelectedDate);
    }
  }, [businessId, selectedStaff, selectedService]);

  if (!businessId || !selectedStaff || !selectedService) {
    return (
      <div className="datetime-selection">
        <h3>Выберите дату и время</h3>
        <div className="no-slots">
          <p>Пожалуйста, сначала выберите услугу и мастера.</p>
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
          availableDates={[]} // Calendar will show all dates, we'll fetch slots when selected
        />
      </div>
      
      {localSelectedDate && (
        <div className="time-selection">
          <h4>Выберите время</h4>
          {loadingSlots ? (
            <div className="loading-slots">
              <p>Загрузка доступных времен...</p>
            </div>
          ) : getAvailableTimes().length > 0 ? (
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
            <div className="no-slots">
              <p>Нет доступных времен для выбранной даты. Попробуйте выбрать другую дату.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
