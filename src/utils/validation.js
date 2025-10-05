// Form validation utilities

export const validateName = (name) => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return 'Name is required';
  }
  if (trimmedName.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (trimmedName.length > 50) {
    return 'Name must be less than 50 characters';
  }
  if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return '';
};

export const validatePhone = (phone) => {
  const trimmedPhone = phone.trim();
  if (!trimmedPhone) {
    return 'Phone number is required';
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = trimmedPhone.replace(/[\s\-\(\)\+]/g, '');
  
  if (digitsOnly.length < 10) {
    return 'Phone number must be at least 10 digits';
  }
  if (digitsOnly.length > 15) {
    return 'Phone number must be less than 15 digits';
  }
  if (!/^[+]?[1-9][\d]{0,15}$/.test(digitsOnly)) {
    return 'Please enter a valid phone number';
  }
  return '';
};

export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX for international numbers
  if (digitsOnly.length === 11 && digitsOnly[0] === '1') {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  
  // Return original if doesn't match common patterns
  return phone;
};

export const validateBookingForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.clientName);
  if (nameError) {
    errors.clientName = nameError;
  }
  
  const phoneError = validatePhone(formData.clientPhone);
  if (phoneError) {
    errors.clientPhone = phoneError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
};
