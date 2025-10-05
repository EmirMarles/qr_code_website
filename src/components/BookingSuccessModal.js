import React from 'react';
import './BookingSuccessModal.css';

const BookingSuccessModal = ({ booking, onClose }) => {
  const handleNewBooking = () => {
    onClose();
    window.location.reload();
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">✅</div>
        <h2>Booking Confirmed!</h2>
        <p className="success-message">
          Your appointment has been successfully booked. You will receive a confirmation message shortly.
        </p>
        
        <div className="booking-details">
          <h3>Booking Details</h3>
          <div className="detail-item">
            <span>Booking ID:</span>
            <span>{booking?.appointmentId || booking?._id || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span>Service:</span>
            <span>{booking?.service?.name || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span>Staff:</span>
            <span>{booking?.staff?.fullName || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span>Date:</span>
            <span>{formatDate(booking?.date)}</span>
          </div>
          <div className="detail-item">
            <span>Time:</span>
            <span>{booking?.startTime || booking?.time}</span>
          </div>
          <div className="detail-item">
            <span>Total:</span>
            <span>${booking?.service?.price || booking?.total || 'N/A'}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="close-btn">
            Close
          </button>
          <button onClick={handleNewBooking} className="new-booking-btn">
            Book Another
          </button>
        </div>

        <div className="success-note">
          <p>💡 Save this page or take a screenshot for your records.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
