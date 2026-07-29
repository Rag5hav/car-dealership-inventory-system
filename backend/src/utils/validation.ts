export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateVehicleInput = (body: any): ValidationResult => {
  const { make, model, category, price, quantity } = body;

  if (!make || typeof make !== 'string' || make.trim().length === 0) {
    return { isValid: false, error: 'Vehicle make is required and must be a valid string' };
  }
  if (!model || typeof model !== 'string' || model.trim().length === 0) {
    return { isValid: false, error: 'Vehicle model is required and must be a valid string' };
  }
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return { isValid: false, error: 'Vehicle category is required' };
  }
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return { isValid: false, error: 'Price must be a non-negative number' };
  }
  if (quantity === undefined || typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
    return { isValid: false, error: 'Quantity must be a non-negative integer' };
  }

  return { isValid: true };
};
