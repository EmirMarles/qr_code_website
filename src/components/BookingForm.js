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

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Примечания не должны превышать 500 символов';
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
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      });
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
          <span>{selectedService?.price || 0} сум</span>
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

      <div className="form-group">
        <label htmlFor="notes">Примечания (необязательно)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleInputChange}
          rows="3"
          placeholder="Дополнительная информация..."
          className={errors.notes ? 'error' : ''}
        />
        {errors.notes && (
          <span className="error-message">{errors.notes}</span>
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
            'Записаться на прием'
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
