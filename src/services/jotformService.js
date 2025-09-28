const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

class JotformService {
  constructor() {
    this.apiKey = config.jotform.apiKey;
    this.baseURL = config.jotform.baseURL;
    this.formId = config.jotform.formId;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'APIKEY': this.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  async getFormSubmissions(submissionId = null) {
    try {
      let url = `/form/${this.formId}/submissions`;
      if (submissionId) {
        url = `/submission/${submissionId}`;
      }

      logger.info(`Fetching submissions from Jotform: ${url}`);

      const response = await this.client.get(url);
      
      if (response.data && response.data.content) {
        logger.info(`Successfully fetched ${submissionId ? 'submission' : 'submissions'} from Jotform`);
        return response.data;
      } else {
        throw new Error('Invalid response format from Jotform API');
      }
    } catch (error) {
      logger.error('Error fetching Jotform submissions:', {
        error: error.message,
        submissionId,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Jotform API key');
      } else if (error.response?.status === 404) {
        throw new Error('Form or submission not found');
      } else {
        throw new Error(`Jotform API error: ${error.message}`);
      }
    }
  }

  async getLatestSubmissions(limit = 10) {
    try {
      const response = await this.getFormSubmissions();
      const submissions = response.content || [];
      
      // Sort by created date and limit results
      const sortedSubmissions = submissions
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);

      return sortedSubmissions;
    } catch (error) {
      logger.error('Error getting latest submissions:', error);
      throw error;
    }
  }
}

module.exports = new JotformService();