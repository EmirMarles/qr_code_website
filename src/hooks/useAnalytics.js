import { useEffect } from 'react';
import { initializeAnalytics, trackBookingEvent } from '../utils/analytics';

export const useAnalytics = () => {
  useEffect(() => {
    // Initialize analytics when component mounts
    initializeAnalytics();
  }, []);

  return {
    trackEvent: trackBookingEvent
  };
};

export const useBookingAnalytics = (selectedService, selectedStaff, selectedDate, selectedTime) => {
  useEffect(() => {
    if (selectedService) {
      trackBookingEvent('service_selected', selectedService);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedStaff) {
      trackBookingEvent('staff_selected', selectedStaff);
    }
  }, [selectedStaff]);

  useEffect(() => {
    if (selectedDate) {
      trackBookingEvent('date_selected', selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      trackBookingEvent('time_selected', selectedTime);
    }
  }, [selectedTime]);
};
