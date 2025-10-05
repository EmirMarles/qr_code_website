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
    const response = await fetch(`${API_BASE_URL}/customer/business/${businessId}`);
    if (response.status === 404) {
      console.warn('Business not found');
      return null;
    }
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error('Failed to fetch business:', error);
    // Return null instead of mock data
    return null;
  }
};

// Fetch services for a business
export const fetchServices = async (businessId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services?business=${businessId}`);
    if (response.status === 404) {
      console.warn('Services not found');
      return [];
    }
    const data = await handleResponse(response);
    return data.services || [];
  } catch (error) {
    console.error('Failed to fetch services:', error);
    // Return empty array instead of mock data
    return [];
  }
};

// Fetch staff for a business
export const fetchStaff = async (businessId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/staff?businessId=${businessId}`);
    if (response.status === 404) {
      console.warn('Staff not found');
      return [];
    }
    const data = await handleResponse(response);
    return data.staff || [];
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    // Return empty array instead of mock data
    return [];
  }
};

// Fetch available time slots
export const fetchAvailableSlots = async (businessId, staffId, serviceId, date) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/book-client/${businessId}/available-slots?date=${date}&staffId=${staffId}&serviceId=${serviceId}`
    );
    if (response.status === 404) {
      console.warn('Available slots not found');
      return [];
    }
    const data = await handleResponse(response);
    return data.availableSlots || [];
  } catch (error) {
    console.error('Failed to fetch available slots:', error);
    // Return empty array instead of mock data
    return [];
  }
};

// Submit booking
export const submitBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/book-client/${bookingData.business}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: bookingData.clientName,
        phoneNumber: bookingData.clientPhone,
        serviceId: bookingData.service,
        staffId: bookingData.staff,
        date: bookingData.date,
        time: bookingData.startTime,
        notes: bookingData.notes || ''
      }),
    });
    if (response.status === 404 || response.status >= 500) {
      throw new Error('Booking service not available');
    }
    return await handleResponse(response);
  } catch (error) {
    console.error('Failed to submit booking:', error);
    throw error;
  }
};

// Mock data functions removed - no longer needed since we show 404 for missing data
// eslint-disable-next-line no-unused-vars
const getMockBusinessData = (businessId) => ({
  _id: businessId,
  name: "Barbershop",
  description: "Professional barbershop services in a relaxing environment",
  category: "Barbershop",
  region: "Tashkent, Uzbekistan",
  address: "123 Main Street, Tashkent, Uzbekistan",
  phone: "+998901234567",
  businessHours: [
    { day: "Понедельник", open: "9:00", close: "18:00", isOpen: true },
    { day: "Вторник", open: "9:00", close: "18:00", isOpen: true },
    { day: "Среда", open: "9:00", close: "18:00", isOpen: true },
    { day: "Четверг", open: "9:00", close: "18:00", isOpen: true },
    { day: "Пятница", open: "9:00", close: "19:00", isOpen: true },
    { day: "Суббота", open: "10:00", close: "17:00", isOpen: true },
    { day: "Воскресенье", open: "10:00", close: "16:00", isOpen: true }
  ],
  paymentOptions: ["card", "cash"],
  instagramLink: "https://instagram.com/barbershop"
});

// eslint-disable-next-line no-unused-vars
const getMockServices = () => [
  {
    _id: "service1",
    name: "Стрижка",
    description: "Профессиональная стрижка волос",
    duration: 60,
    price: 50000
  },
  {
    _id: "service2",
    name: "Бритье",
    description: "Классическое бритье с горячим полотенцем",
    duration: 45,
    price: 35000
  },
  {
    _id: "service3",
    name: "Стрижка + Бритье",
    description: "Комплексная услуга стрижка и бритье",
    duration: 90,
    price: 75000
  },
  {
    _id: "service4",
    name: "Укладка",
    description: "Стильная укладка волос",
    duration: 30,
    price: 25000
  }
];

// eslint-disable-next-line no-unused-vars
const getMockStaff = () => [
  {
    _id: "staff1",
    fullName: "Ахмед Каримов",
    position: "Старший барбер",
    bio: "10+ лет опыта в стрижке и бритье",
    photos: {
      avatar: {
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      }
    }
  },
  {
    _id: "staff2",
    fullName: "Игорь Петров",
    position: "Мастер по стрижке",
    bio: "Специалист по современным стрижкам",
    photos: {
      avatar: {
        url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      }
    }
  },
  {
    _id: "staff3",
    fullName: "Дмитрий Соколов",
    position: "Барбер",
    bio: "Классическое бритье и укладка",
    photos: {
      avatar: {
        url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face"
      }
    }
  },
  {
    _id: "staff4",
    fullName: "Максим Волков",
    position: "Стилист",
    bio: "Современные прически и укладки",
    photos: {
      avatar: {
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      }
    }
  }
];

// eslint-disable-next-line no-unused-vars
const getMockAvailableSlots = (date) => {
  // Generate time slots for the selected date
  const times = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];
  
  return times.map(time => ({
    date: date,
    startTime: time,
    available: true
  }));
};

// eslint-disable-next-line no-unused-vars
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
