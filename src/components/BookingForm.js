import React, { useState } from 'react';
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
    } else if (!/^\+998[0-9]{9}$/.test(formData.clientPhone.replace(/[\s\-()]/g, ''))) {
      newErrors.clientPhone = 'Введите номер в формате +998XXXXXXXXX';
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
          <div className="price-summary">
            {selectedService?.discount ? (
              <>
                <span className="original-price">{selectedService.price?.toLocaleString() || '0'} сум</span>
                <span className="discounted-price">{((selectedService.price || 0) * (1 - selectedService.discount / 100)).toLocaleString()} сум</span>
                <span className="discount-info">-{selectedService.discount}%</span>
              </>
            ) : (
              <span>{selectedService?.price?.toLocaleString() || '0'} сум</span>
            )}
          </div>
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
          placeholder="+998901234567"
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
        <p>📝 Вы получите подтверждение после обработки вашей записи.</p>
      </div>
    </form>
  );
};

export default BookingForm;
