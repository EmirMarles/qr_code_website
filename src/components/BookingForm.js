import React, { useState } from 'react';
import Loading from './Loading';
import './BookingForm.css';

const BookingForm = ({ onSubmit, selectedService, selectedStaff, selectedDate, selectedTime, formData, onFormDataChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Имя обязательно';
    } else if (formData.clientName.trim().length < 2 || formData.clientName.trim().length > 50) {
      newErrors.clientName = 'Имя должно содержать от 2 до 50 символов';
    }
    
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Номер телефона обязателен';
    } else {
      // Remove all non-digit characters for validation
      const cleanedPhone = formData.clientPhone.replace(/\D/g, '');
      
      // Accept various formats: 998XXXXXXXXX, 90XXXXXXXXX, 8XXXXXXXXX, or 9XXXXXXXXX
      if (!/^(998|90|8|9)[0-9]{8,9}$/.test(cleanedPhone)) {
        newErrors.clientPhone = 'Введите корректный номер телефона';
      }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        clientName: formData.clientName.trim(),
        clientPhone: formData.clientPhone.trim(),
        date: selectedDate,
        startTime: selectedTime,
        notes: formData.notes || ''
      };

      await onSubmit(bookingData);
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Ошибка при создании записи. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Russian month names
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];
      
      // Russian weekday names
      const weekdays = [
        'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 
        'Четверг', 'Пятница', 'Суббота'
      ];
      
      const weekday = weekdays[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${weekday}, ${day} ${month} ${year}`;
    } catch (error) {
      return dateString;
    }
  };

  if (isSubmitting) {
    return (
      <div className="booking-form">
        <Loading message="Создание записи..." />
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Завершите запись</h3>
      <p className="section-description">Проверьте ваш выбор и укажите контактную информацию</p>
      
      <div className="booking-summary">
        <h4>Детали записи</h4>
        <div className="summary-item">
          <span>Услуга:</span>
          <span>{selectedService?.name}</span>
        </div>
        <div className="summary-item">
          <span>Мастер:</span>
          <span>{selectedStaff?.fullName}</span>
        </div>
        <div className="summary-item">
          <span>Дата:</span>
          <span>{formatDate(selectedDate)}</span>
        </div>
        <div className="summary-item">
          <span>Время:</span>
          <span>{selectedTime}</span>
        </div>
        <div className="summary-item total">
          <span>Сумма:</span>
          <span>
            {selectedService?.discount 
              ? ((selectedService.price || 0) * (1 - selectedService.discount / 100)).toLocaleString() + ' сум'
              : (selectedService?.price?.toLocaleString() || '0') + ' сум'
            }
          </span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="clientName">Ваше имя *</label>
        <input
          type="text"
          id="clientName"
          name="clientName"
          value={formData.clientName}
          onChange={handleInputChange}
          placeholder="Введите ваше имя"
          className={errors.clientName ? 'error' : ''}
          required
        />
        {errors.clientName && (
          <span className="error-message">{errors.clientName}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="clientPhone">Номер телефона *</label>
        <input
          type="tel"
          id="clientPhone"
          name="clientPhone"
          value={formData.clientPhone}
          onChange={handleInputChange}
          placeholder="+998 90 123 45 67"
          className={errors.clientPhone ? 'error' : ''}
          required
        />
        {errors.clientPhone && (
          <span className="error-message">{errors.clientPhone}</span>
        )}
      </div>


      <div className="form-actions">
        <button 
          type="submit" 
          className="book-btn"
          disabled={isSubmitting || !selectedService || !selectedStaff || !selectedDate || !selectedTime}
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner"></span>
              Запись...
            </>
          ) : (
            <>
              <span className="checkmark-icon">✓</span>
              Подтвердить запись
            </>
          )}
        </button>
      </div>

      <div className="booking-note">
        <p>📱 <strong>SMS-подтверждение:</strong> После подтверждения бизнесом вы получите SMS на указанный номер телефона.</p>
      </div>
    </form>
  );
};

export default BookingForm;
