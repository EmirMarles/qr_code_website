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
      newErrors.clientName = 'Name is required';
    }
    
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Phone number is required';
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.clientPhone.replace(/[\s\-()]/g, ''))) {
      newErrors.clientPhone = 'Please enter a valid phone number';
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
        startTime: selectedTime
      };

      await onSubmit(bookingData);
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to book appointment. Please try again.');
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
      <h3>Complete Your Booking</h3>
      <p className="section-description">Review your selection and provide your contact information</p>
      
      <div className="booking-summary">
        <h4>Booking Summary</h4>
        <div className="summary-item">
          <span>Service:</span>
          <span>{selectedService?.name}</span>
        </div>
        <div className="summary-item">
          <span>Staff:</span>
          <span>{selectedStaff?.fullName}</span>
        </div>
        <div className="summary-item">
          <span>Date:</span>
          <span>{formatDate(selectedDate)}</span>
        </div>
        <div className="summary-item">
          <span>Time:</span>
          <span>{selectedTime}</span>
        </div>
        <div className="summary-item total">
          <span>Total:</span>
          <span>${selectedService?.price || 0}</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="clientName">Your Name *</label>
        <input
          type="text"
          id="clientName"
          name="clientName"
          value={formData.clientName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          className={errors.clientName ? 'error' : ''}
          required
        />
        {errors.clientName && (
          <span className="error-message">{errors.clientName}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="clientPhone">Phone Number *</label>
        <input
          type="tel"
          id="clientPhone"
          name="clientPhone"
          value={formData.clientPhone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
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
              Booking...
            </>
          ) : (
            'Book Appointment'
          )}
        </button>
      </div>

      <div className="booking-note">
        <p>📝 You will receive a confirmation message once your booking is processed.</p>
      </div>
    </form>
  );
};

export default BookingForm;
