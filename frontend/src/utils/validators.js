// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Password validation (min 8 chars, at least one letter and one number)
export const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain at least one letter and one number';
  }
  return null;
};

// Phone number validation
export const validatePhoneNumber = (phone) => {
  const re = /^[\d\s\-\(\)]+$/;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) {
    return 'Phone number must be at least 10 digits';
  }
  if (!re.test(phone)) {
    return 'Invalid phone number format';
  }
  return null;
};

// Zip code validation
export const validateZipCode = (zipCode) => {
  const re = /^\d{5}(-\d{4})?$/;
  if (!re.test(zipCode)) {
    return 'Invalid zip code format';
  }
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// Min length validation
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

// Max length validation
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return null;
};

// Number validation
export const validateNumber = (value, fieldName = 'This field') => {
  if (isNaN(Number(value))) {
    return `${fieldName} must be a valid number`;
  }
  return null;
};

// Min value validation
export const validateMinValue = (value, minValue, fieldName = 'This field') => {
  if (Number(value) < minValue) {
    return `${fieldName} must be at least ${minValue}`;
  }
  return null;
};

// Max value validation
export const validateMaxValue = (value, maxValue, fieldName = 'This field') => {
  if (Number(value) > maxValue) {
    return `${fieldName} must be no more than ${maxValue}`;
  }
  return null;
};

// Date validation
export const validateDate = (date, fieldName = 'Date') => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} is not a valid date`;
  }
  return null;
};

// Future date validation
export const validateFutureDate = (date, fieldName = 'Date') => {
  const dateObj = new Date(date);
  const now = new Date();
  if (dateObj <= now) {
    return `${fieldName} must be in the future`;
  }
  return null;
};

// Credit card validation (basic Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) {
    return 'Invalid card number length';
  }

  let sum = 0;
  let isEven = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return 'Invalid card number';
  }
  return null;
};
