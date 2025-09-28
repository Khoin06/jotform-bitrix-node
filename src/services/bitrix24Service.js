const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

class Bitrix24Service {
  constructor() {
    this.webhookUrl = config.bitrix24.webhookUrl;
    this.client = axios.create({
      timeout: 15000
    });
  }

  async createContact(contactData) {
    try {
      const { name, email, phone } = contactData;

      logger.info('Creating contact in Bitrix24:', { name, email, phone });

      const payload = {
        fields: {
          NAME: name,
          EMAIL: [{ VALUE: email, VALUE_TYPE: 'WORK' }],
          PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }]
        },
        params: { 
          REGISTER_SONET_EVENT: 'Y' 
        }
      };

      const url = `${this.webhookUrl}/${config.bitrix24.contactEndpoint}`;
      
      const response = await this.client.post(url, payload);

      if (response.data && response.data.result) {
        logger.info('Successfully created contact in Bitrix24', {
          contactId: response.data.result,
          name,
          email
        });
        return response.data.result;
      } else if (response.data && response.data.error) {
        throw new Error(`Bitrix24 API error: ${response.data.error_description}`);
      } else {
        throw new Error('Invalid response from Bitrix24 API');
      }
    } catch (error) {
      logger.error('Error creating contact in Bitrix24:', {
        error: error.message,
        contactData,
        status: error.response?.status,
        response: error.response?.data
      });

      if (error.response?.status === 401) {
        throw new Error('Invalid Bitrix24 webhook URL or access denied');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid contact data sent to Bitrix24');
      } else {
        throw new Error(`Bitrix24 API error: ${error.message}`);
      }
    }
  }

  async testConnection() {
    try {
      const url = `${this.webhookUrl}/crm.contact.fields`;
      const response = await this.client.get(url);
      
      return response.data && !response.data.error;
    } catch (error) {
      logger.error('Bitrix24 connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = new Bitrix24Service();