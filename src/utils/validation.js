const logger = require('./logger');

class ValidationUtils {
  static validateJotformSubmission(data) {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid submission data: data is not an object');
      }

      const requiredFields = ['name', 'email', 'phone'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }

      // Validate phone (basic validation)
      if (typeof data.phone !== 'string' || data.phone.trim().length < 5) {
        throw new Error('Invalid phone number');
      }

      return true;
    } catch (error) {
      logger.error('Validation error:', error);
      throw error;
    }
  }

  static extractFormData(formData) {
    try {
      // Jotform returns data in a specific structure
      // This function maps Jotform field names to our expected format
      const extracted = {};
      
      for (const key in formData) {
        const field = formData[key];
        if (typeof field === 'object' && field.name && field.answer) {
          const fieldName = field.name.toLowerCase();
          
          if (fieldName.includes('name') || fieldName.includes('fullname')) {
            extracted.name = field.answer;
          } else if (fieldName.includes('email')) {
            extracted.email = field.answer;
          } else if (fieldName.includes('phone')) {
            extracted.phone = field.answer;
          }
        }
      }

      return extracted;
    } catch (error) {
      logger.error('Error extracting form data:', error);
      throw new Error('Failed to extract form data');
    }
  }
}

module.exports = ValidationUtils;