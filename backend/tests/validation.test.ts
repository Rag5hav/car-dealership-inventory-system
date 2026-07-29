import { validateEmail, validateVehicleInput } from '../src/utils/validation';
import { AppError, BadRequestError, NotFoundError } from '../src/utils/AppError';

describe('Validation & Error Utilities (Unit Tests)', () => {
  describe('validateEmail', () => {
    it('should return true for valid email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('admin.user@dealership.co.in')).toBe(true);
    });

    it('should return false for invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('validateVehicleInput', () => {
    it('should pass for complete valid vehicle payload', () => {
      const result = validateVehicleInput({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 5,
      });
      expect(result.isValid).toBe(true);
    });

    it('should fail if make is missing or empty', () => {
      const result = validateVehicleInput({
        make: '   ',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 5,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('make is required');
    });

    it('should fail if price is negative', () => {
      const result = validateVehicleInput({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: -500,
        quantity: 5,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('non-negative number');
    });

    it('should fail if quantity is not an integer', () => {
      const result = validateVehicleInput({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3.5,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('non-negative integer');
    });
  });

  describe('AppError Exception Hierarchy', () => {
    it('should construct BadRequestError with default 400 status', () => {
      const error = new BadRequestError('Invalid query parameter');
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid query parameter');
      expect(error.isOperational).toBe(true);
    });

    it('should construct NotFoundError with 404 status', () => {
      const error = new NotFoundError('Vehicle ID not found');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Vehicle ID not found');
    });
  });
});
