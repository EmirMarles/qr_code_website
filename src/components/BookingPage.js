import React, { useState, useEffect, useMemo } from 'react';
import BusinessInfoModal from './BusinessInfoModal';
import ServiceSelection from './ServiceSelection';
import StaffSelection from './StaffSelection';
import DateTimeSelection from './DateTimeSelection';
import BookingForm from './BookingForm';
import BookingSuccessModal from './BookingSuccessModal';
import ProgressIndicator from './ProgressIndicator';
import StickyCTA from './StickyCTA';
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
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
          // Use sample services with categories for demonstration
          setServices([
            {
              _id: "service1",
              name: "Haircut",
              category: "Hair",
              duration: 60,
              price: 500000,
              staff: ["staff1", "staff2"]
            },
            {
              _id: "service2", 
              name: "Massage",
              category: "Wellness",
              duration: 60,
              price: 200000,
              staff: ["staff3", "staff4"]
            },
            {
              _id: "service3",
              name: "Классический массаж",
              category: "Wellness", 
              duration: 45,
              price: 200000,
              staff: ["staff3", "staff4"]
            },
            {
              _id: "service4",
              name: "Beard Trim",
              category: "Hair",
              duration: 30,
              price: 150000,
              staff: ["staff1", "staff2"]
            },
            {
              _id: "service5",
              name: "Facial Treatment",
              category: "Skincare",
              duration: 90,
              price: 300000,
              staff: ["staff5"]
            },
            {
              _id: "service6",
              name: "Manicure",
              // No category - will be grouped under "Другое"
              duration: 45,
              price: 100000,
              staff: ["staff6"]
            },
            {
              _id: "service7",
              name: "Pedicure",
              // No category - will be grouped under "Другое"
              duration: 60,
              price: 120000,
              staff: ["staff6"]
            },
            {
              _id: "service8",
              name: "Premium Haircut",
              category: "Hair",
              duration: 75,
              price: 400000,
              discount: 20, // 20% discount
              staff: ["staff1", "staff2"]
            },
            {
              _id: "service9",
              name: "Deep Tissue Massage",
              category: "Wellness",
              duration: 90,
              price: 350000,
              discount: 15, // 15% discount
              staff: ["staff3", "staff4"]
            },
            {
              _id: "service10",
              name: "VIP Facial Treatment",
              category: "Skincare",
              duration: 120,
              price: 500000,
              discount: 25, // 25% discount
              staff: ["staff5"]
            }
          ]);
        }
        
        if (businessData.staff && Array.isArray(businessData.staff)) {
          setStaff(businessData.staff);
        } else {
          console.warn('Staff data not found in business data');
          // Use sample staff data for demonstration
          setStaff([
            {
              _id: "staff1",
              fullName: "Dilshod boy",
              position: "The Greatest barber",
              bio: "10+ years of experience"
            },
            {
              _id: "staff2",
              fullName: "Bobur",
              position: "Manager",
              bio: "Professional barber"
            },
            {
              _id: "staff3",
              fullName: "Ahmed",
              position: "Senior Barber",
              bio: "Specialist in modern cuts"
            },
            {
              _id: "staff4",
              fullName: "Igor",
              position: "Master Barber",
              bio: "Classic and contemporary styles"
            }
          ]);
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

  // Staff filtered by selected service
  const filteredStaff = useMemo(() => {
    // If no service selected yet or staff not loaded, show none
    if (!selectedService || !Array.isArray(staff)) return [];
    // If service contains a list of staff IDs, filter by it
    const staffIdsForService = selectedService.staff;
    if (Array.isArray(staffIdsForService) && staffIdsForService.length > 0) {
      const idSet = new Set(staffIdsForService.map(String));
      return staff.filter(s => idSet.has(String(s._id)));
    }
    // No mapping provided -> show none
    return [];
  }, [selectedService, staff]);

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
    // Convert Date object to string format expected by backend
    const dateString = date ? date.toISOString().split('T')[0] : null;
    setSelectedDate(dateString);
    setSelectedTime(time);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      setIsSubmitting(true);
      const result = await submitBooking({
        ...bookingData,
        business: businessId,
        staff: selectedStaff._id,
        service: selectedService._id,
        date: selectedDate,
        startTime: selectedTime
      });
      // Normalize response for success modal to avoid N/A/Invalid Date
      const bookingForModal = {
        appointmentId: result?.appointmentId || result?._id || result?.id || result?.bookingId,
        service: result?.service || {
          name: selectedService?.name,
          price: selectedService?.price
        },
        staff: result?.staff || {
          fullName: selectedStaff?.fullName
        },
        date: result?.date || result?.bookingDate || selectedDate,
        startTime: result?.startTime || result?.time || selectedTime,
        total: result?.total || result?.price || selectedService?.price,
        status: result?.status,
      };

      setBookingResult(bookingForModal);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Booking failed:', err);
      // Show specific error message from backend
      alert(`Ошибка при создании записи: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    // Auto-advance logic based on current step
    if (selectedService && !selectedStaff) {
      // Move to staff selection
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (selectedService && selectedStaff && !selectedDate) {
      // Move to date selection
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (selectedService && selectedStaff && selectedDate && !selectedTime) {
      // Move to time selection
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canContinue = () => {
    if (!selectedService) return false;
    if (selectedService && !selectedStaff) return true;
    if (selectedService && selectedStaff && !selectedDate) return true;
    if (selectedService && selectedStaff && selectedDate && !selectedTime) return true;
    return false;
  };

  const getContinueButtonText = () => {
    if (!selectedService) return "Выберите услугу";
    if (selectedService && !selectedStaff) return "Выберите мастера";
    if (selectedService && selectedStaff && !selectedDate) return "Выберите дату";
    if (selectedService && selectedStaff && selectedDate && !selectedTime) return "Выберите время";
    return "Продолжить";
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

      // Calculate current step for progress indicator
      const getCurrentStep = () => {
        if (selectedService && selectedStaff && selectedDate && selectedTime) return 5; // Booking form
        if (selectedService && selectedStaff && selectedDate) return 4; // Time selection
        if (selectedService && selectedStaff) return 3; // Date selection
        if (selectedService) return 2; // Staff selection
        return 1; // Service selection
      };

      return (
        <div className="booking-page">
          <div className="container">
            {/* Progress Indicator */}
            <ProgressIndicator currentStep={getCurrentStep()} totalSteps={5} />

            {/* Header */}
            <header className="header">
              <div className="business-header-content">
                <div className="business-name">{business.name}</div>
                <div className="business-address">
                  {business.location?.address || business.address}
                </div>
              </div>
              <div className="header-icons">
                <button 
                  className="info-button"
                  onClick={() => setShowBusinessInfo(true)}
                  aria-label="Business info"
                >
                  i
                </button>
                {business?.instagramLink && (
                  <a 
                    href={business.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="instagram-button"
                    aria-label="Instagram"
                  >
                    {/* Instagram glyph */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 2H17C20 2 22 4 22 7V17C22 20 20 22 17 22H7C4 22 2 20 2 17V7C2 4 4 2 7 2Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                    </svg>
                  </a>
                )}
              </div>
            </header>


        {/* Service Selection */}
        <ServiceSelection 
          services={services}
          onSelectService={handleServiceSelect}
          selectedService={selectedService}
        />

        {/* Staff Selection */}
        {selectedService && (
          <StaffSelection 
            staff={filteredStaff}
            onSelectStaff={handleStaffSelect}
            selectedStaff={selectedStaff}
          />
        )}


        {/* Date and Time Selection */}
        {selectedService && selectedStaff && (
          <DateTimeSelection 
            availableSlots={availableSlots}
            onSelectDateTime={handleDateTimeSelect}
            selectedDate={selectedDate ? new Date(selectedDate) : null}
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

            {/* Business Info Modal */}
            {showBusinessInfo && (
              <BusinessInfoModal 
                business={business}
                onClose={() => setShowBusinessInfo(false)}
              />
            )}

            {/* Success Modal */}
            {showSuccessModal && bookingResult && (
              <BookingSuccessModal 
                booking={bookingResult}
                onClose={handleCloseSuccessModal}
              />
            )}

            {/* Sticky CTA */}
            <StickyCTA
              currentStep={getCurrentStep()}
              totalSteps={5}
              onContinue={handleContinue}
              canContinue={canContinue()}
              buttonText={getContinueButtonText()}
              isLoading={isSubmitting}
            />
      </div>
    </div>
  );
};

export default BookingPage;
