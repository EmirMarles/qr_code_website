import React, { useState, useEffect } from 'react';
import BusinessInfo from './BusinessInfo';
import ServiceSelection from './ServiceSelection';
import StaffSelection from './StaffSelection';
import DateTimeSelection from './DateTimeSelection';
import BookingForm from './BookingForm';
import BookingSuccessModal from './BookingSuccessModal';
import NotFound from './NotFound';
import { fetchBusinessData, fetchServicesByStaff, fetchAvailableSlots, submitBooking } from '../services/api';
import './BookingPage.css';

const BookingPage = ({ businessId: propBusinessId }) => {
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    clientName: '',
    clientPhone: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  
  // Get business ID from prop or URL parameters
  const getBusinessId = () => {
    if (propBusinessId) return propBusinessId;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('businessId') || 'default-business-id';
  };
  
  const businessId = getBusinessId();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch business data (should include embedded services and staff)
        const businessData = await fetchBusinessData(businessId);
        if (!businessData) {
          throw new Error('Business not found');
        }
        setBusiness(businessData);

        // Extract services and staff from business data (should be embedded)
        if (businessData.services && Array.isArray(businessData.services)) {
          setServices(businessData.services);
        } else {
          console.warn('Services not found in business data');
          setServices([]);
        }
        
        if (businessData.staff && Array.isArray(businessData.staff)) {
          setStaff(businessData.staff);
        } else {
          console.warn('Staff data not found in business data');
          setStaff([]);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [businessId]);

  // Fetch available slots when service, staff, or date changes
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedService || !selectedStaff || !selectedDate) {
        setAvailableSlots([]);
        return;
      }

      try {
        const slots = await fetchAvailableSlots(
          businessId,
          selectedStaff._id,
          selectedService._id,
          selectedDate
        );
        setAvailableSlots(slots);
      } catch (err) {
        console.error('Failed to load available slots:', err);
        setAvailableSlots([]);
      }
    };

    loadAvailableSlots();
  }, [businessId, selectedService, selectedStaff, selectedDate]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    // Reset dependent selections
    setSelectedStaff(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleStaffSelect = async (staffMember) => {
    setSelectedStaff(staffMember);
    // Reset dependent selections
    setSelectedDate(null);
    setSelectedTime(null);
    
    // Load services specific to this staff member (matches QR flow)
    try {
      const staffServices = await fetchServicesByStaff(businessId, staffMember._id);
      if (staffServices && staffServices.length > 0) {
        setServices(staffServices);
      }
    } catch (error) {
      console.error('Failed to load services for staff:', error);
      // Keep existing services if fetch fails
    }
  };

  const handleDateTimeSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      const result = await submitBooking({
        ...bookingData,
        business: businessId,
        staff: selectedStaff._id,
        service: selectedService._id,
        date: selectedDate,
        startTime: selectedTime
      });

      setBookingResult(result);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Booking failed:', err);
      // Show specific error message from backend
      alert(`Ошибка при создании записи: ${err.message}`);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setBookingResult(null);
    // Reset all selections
    setSelectedService(null);
    setSelectedStaff(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingForm({ clientName: '', clientPhone: '', notes: '' });
  };

  if (isLoading) {
    return (
      <div className="booking-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading booking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-page">
        <div className="error-container">
          <h2>Error Loading Booking Page</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!business) {
    return <NotFound />;
  }

  return (
        <div className="booking-page">
          <div className="container">
            {/* Header */}
            <header className="header">
              <div className="logo">
                {business.name}
              </div>
              <div className="category">
                💈 Barbershop
              </div>
            </header>

        {/* Business Information */}
        <BusinessInfo business={business} />

        {/* Service Selection */}
        <ServiceSelection 
          services={services}
          onSelectService={handleServiceSelect}
          selectedService={selectedService}
        />

        {/* Staff Selection */}
        {selectedService && (
          <StaffSelection 
            staff={staff}
            onSelectStaff={handleStaffSelect}
            selectedStaff={selectedStaff}
          />
        )}

        {/* Date Selection */}
        {selectedService && selectedStaff && (
          <div className="date-picker-section">
            <h3>Выберите дату</h3>
            <p className="section-description">Выберите дату для записи</p>
            <input
              type="date"
              value={selectedDate || ''}
              onChange={(e) => {
                const date = e.target.value;
                setSelectedDate(date);
                setSelectedTime(null);
                setAvailableSlots([]);
              }}
              min={new Date().toISOString().split('T')[0]}
              className="date-input"
            />
          </div>
        )}

        {/* Time Selection */}
        {selectedService && selectedStaff && selectedDate && (
          <DateTimeSelection 
            availableSlots={availableSlots}
            onSelectDateTime={handleDateTimeSelect}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        )}

        {/* Booking Form */}
        {selectedService && selectedStaff && selectedDate && selectedTime && (
          <BookingForm 
            onSubmit={handleBookingSubmit}
            selectedService={selectedService}
            selectedStaff={selectedStaff}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            formData={bookingForm}
            onFormDataChange={setBookingForm}
          />
        )}

        {/* Success Modal */}
        {showSuccessModal && bookingResult && (
          <BookingSuccessModal 
            booking={bookingResult}
            onClose={handleCloseSuccessModal}
          />
        )}
      </div>
    </div>
  );
};

export default BookingPage;
