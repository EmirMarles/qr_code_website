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
      const russianWeekdays = {
        0: 'Воскресенье',
        1: 'Понедельник', 
        2: 'Вторник',
        3: 'Среда',
        4: 'Четверг',
        5: 'Пятница',
        6: 'Суббота'
      };
      
      const russianMonths = {
        0: 'января',
        1: 'февраля',
        2: 'марта',
        3: 'апреля',
        4: 'мая',
        5: 'июня',
        6: 'июля',
        7: 'августа',
        8: 'сентября',
        9: 'октября',
        10: 'ноября',
        11: 'декабря'
      };
      
      const weekday = russianWeekdays[date.getDay()];
      const day = date.getDate();
      const month = russianMonths[date.getMonth()];
      const year = date.getFullYear();
      
      return `${weekday}, ${day} ${month} ${year}`;
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">✅</div>
        <h2>Запись подтверждена!</h2>
        <p className="success-message">
          Ваша запись успешно создана. Вы получите подтверждение в ближайшее время.
        </p>
        
        <div className="booking-details">
          <h3>Детали записи</h3>
          <div className="detail-item">
            <span>Услуга:</span>
            <span>{booking?.service?.name || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span>Мастер:</span>
            <span>{booking?.staff?.fullName || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span>Дата:</span>
            <span>{formatDate(booking?.date)}</span>
          </div>
          <div className="detail-item">
            <span>Время:</span>
            <span>{booking?.startTime || booking?.time}</span>
          </div>
          <div className="detail-item">
            <span>Сумма:</span>
            <span>{booking?.service?.price || booking?.total || 'N/A'} сум</span>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="close-btn">
            Закрыть
          </button>
          <button onClick={handleNewBooking} className="new-booking-btn">
            Новая запись
          </button>
        </div>

        <div className="success-note">
          <p>💡 Сохраните эту страницу или сделайте скриншот для ваших записей.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
