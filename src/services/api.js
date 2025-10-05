// API Base URL - Connected to your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bookme-backend-536445311459.europe-central2.run.app/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Fetch business data
export const fetchBusinessData = async (businessId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`);
    if (response.status === 404) {
      console.warn('Business not found, using mock data');
      return getMockBusinessData(businessId);
    }
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch business:', error);
    console.log('Using mock data for development');
    // Return mock data for development
    return getMockBusinessData(businessId);
  }
};

// Fetch services for a business
export const fetchServices = async (businessId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services?business=${businessId}`);
    if (response.status === 404) {
      console.warn('Services not found, using mock data');
      return getMockServices();
    }
    const data = await handleResponse(response);
    return data.services || [];
  } catch (error) {
    console.error('Failed to fetch services:', error);
    console.log('Using mock data for development');
    // Return mock data for development
    return getMockServices();
  }
};

// Fetch staff for a business
export const fetchStaff = async (businessId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/staff?businessId=${businessId}`);
    if (response.status === 404) {
      console.warn('Staff not found, using mock data');
      return getMockStaff();
    }
    const data = await handleResponse(response);
    return data.staff || [];
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    console.log('Using mock data for development');
    // Return mock data for development
    return getMockStaff();
  }
};

// Fetch available time slots
export const fetchAvailableSlots = async (businessId, staffId, serviceId, date) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/appointments/available-slots?businessId=${businessId}&staffId=${staffId}&serviceId=${serviceId}&date=${date}`
    );
    if (response.status === 404) {
      console.warn('Available slots not found, using mock data');
      return getMockAvailableSlots(date);
    }
    const data = await handleResponse(response);
    return data.slots || [];
  } catch (error) {
    console.error('Failed to fetch available slots:', error);
    console.log('Using mock data for development');
    // Return mock data for development
    return getMockAvailableSlots(date);
  }
};

// Submit booking
export const submitBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    if (response.status === 404 || response.status >= 500) {
      console.warn('Booking endpoint not available, using mock response');
      return getMockBookingResponse(bookingData);
    }
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to submit booking:', error);
    console.log('Using mock response for development');
    // Return mock success response for development
    return getMockBookingResponse(bookingData);
  }
};

// Mock data functions for development/testing
const getMockBusinessData = (businessId) => ({
  _id: businessId,
  name: "Beauty Studio Pro",
  description: "Professional beauty services in a relaxing environment",
  category: "Beauty & Wellness",
  region: "New York, NY",
  location: {
    address: "123 Main Street, New York, NY 10001"
  },
  phone: "+1 (555) 123-4567",
  businessHours: [
    { day: "Monday", open: "9:00 AM", close: "6:00 PM", isOpen: true },
    { day: "Tuesday", open: "9:00 AM", close: "6:00 PM", isOpen: true },
    { day: "Wednesday", open: "9:00 AM", close: "6:00 PM", isOpen: true },
    { day: "Thursday", open: "9:00 AM", close: "6:00 PM", isOpen: true },
    { day: "Friday", open: "9:00 AM", close: "7:00 PM", isOpen: true },
    { day: "Saturday", open: "10:00 AM", close: "5:00 PM", isOpen: true },
    { day: "Sunday", open: "10:00 AM", close: "4:00 PM", isOpen: true }
  ],
  paymentOptions: ["card", "cash", "online"],
  instagramLink: "https://instagram.com/beautystudiopro"
});

const getMockServices = () => [
  {
    _id: "service1",
    name: "Haircut & Styling",
    description: "Professional haircut with styling and consultation",
    duration: 60,
    price: 75
  },
  {
    _id: "service2",
    name: "Hair Coloring",
    description: "Full hair coloring service with premium products",
    duration: 120,
    price: 150
  },
  {
    _id: "service3",
    name: "Manicure",
    description: "Classic manicure with nail shaping and polish",
    duration: 45,
    price: 35
  },
  {
    _id: "service4",
    name: "Facial Treatment",
    description: "Deep cleansing facial with moisturizing treatment",
    duration: 90,
    price: 120
  }
];

const getMockStaff = () => [
  {
    _id: "staff1",
    fullName: "Sarah Johnson",
    position: "Senior Stylist",
    bio: "10+ years of experience in hair styling and coloring",
    photos: {
      avatar: {
        url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      }
    }
  },
  {
    _id: "staff2",
    fullName: "Emily Chen",
    position: "Color Specialist",
    bio: "Expert in hair coloring and highlighting techniques",
    photos: {
      avatar: {
        url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      }
    }
  },
  {
    _id: "staff3",
    fullName: "Jessica Martinez",
    position: "Nail Technician",
    bio: "Specialized in manicures, pedicures, and nail art",
    photos: {
      avatar: {
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      }
    }
  },
  {
    _id: "staff4",
    fullName: "Amanda Wilson",
    position: "Esthetician",
    bio: "Certified facial specialist with focus on skin health",
    photos: {
      avatar: {
        url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
      }
    }
  }
];

const getMockAvailableSlots = (date) => {
  const baseDate = new Date(date);
  const slots = [];
  
  // Generate slots for the next 7 days
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Generate time slots from 9 AM to 6 PM
    const times = [
      "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
      "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
    ];
    
    times.forEach(time => {
      slots.push({
        date: dateString,
        startTime: time,
        available: true
      });
    });
  }
  
  return slots;
};

const getMockBookingResponse = (bookingData) => ({
  appointmentId: `APT-${Date.now()}`,
  _id: `booking_${Date.now()}`,
  date: bookingData.date,
  startTime: bookingData.startTime,
  time: bookingData.startTime,
  service: {
    name: "Mock Service",
    price: 75
  },
  staff: {
    fullName: "Mock Staff"
  },
  total: 75,
  status: "confirmed",
  createdAt: new Date().toISOString()
});
