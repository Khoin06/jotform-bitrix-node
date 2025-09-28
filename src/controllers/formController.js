const jotformService = require('../services/jotformService');
const bitrix24Service = require('../services/bitrix24Service');
const ValidationUtils = require('../utils/validation');
const logger = require('../utils/logger');

class FormController {
  async processWebhook(req, res) {
    const startTime = Date.now();
    
    try {
      logger.info('Received webhook request', {
        body: req.body,
        headers: req.headers,
        ip: req.ip
      });

      // Extract and validate data from Jotform webhook
      const formData = req.body;
      const extractedData = ValidationUtils.extractFormData(formData);
      
      // Validate the extracted data
      ValidationUtils.validateJotformSubmission(extractedData);

      logger.info('Extracted form data:', extractedData);

      // Create contact in Bitrix24
      const contactId = await bitrix24Service.createContact(extractedData);

      const processingTime = Date.now() - startTime;
      
      logger.info('Webhook processed successfully', {
        processingTime: `${processingTime}ms`,
        contactId,
        formData: extractedData
      });

      res.status(200).json({
        success: true,
        message: 'Contact created successfully',
        contactId,
        processingTime: `${processingTime}ms`
      });

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      logger.error('Webhook processing failed', {
        error: error.message,
        processingTime: `${processingTime}ms`,
        body: req.body
      });

      res.status(400).json({
        success: false,
        error: error.message,
        processingTime: `${processingTime}ms`
      });
    }
  }

  async manualSync(req, res) {
    try {
      const { limit = 5 } = req.query;
      logger.info('Manual sync requested', { limit });

      // Get latest submissions from Jotform
      const submissions = await jotformService.getLatestSubmissions(parseInt(limit));
      
      const results = {
        processed: 0,
        succeeded: 0,
        failed: 0,
        details: []
      };

      // Process each submission
      for (const submission of submissions) {
        try {
          const extractedData = ValidationUtils.extractFormData(submission.answers);
          ValidationUtils.validateJotformSubmission(extractedData);

          const contactId = await bitrix24Service.createContact(extractedData);
          
          results.succeeded++;
          results.details.push({
            submissionId: submission.id,
            contactId,
            status: 'success',
            data: extractedData
          });

        } catch (error) {
          results.failed++;
          results.details.push({
            submissionId: submission.id,
            status: 'failed',
            error: error.message
          });
          logger.error(`Failed to process submission ${submission.id}:`, error);
        }

        results.processed++;
      }

      logger.info('Manual sync completed', results);

      res.status(200).json({
        success: true,
        message: `Sync completed. Processed: ${results.processed}, Succeeded: ${results.succeeded}, Failed: ${results.failed}`,
        ...results
      });

    } catch (error) {
      logger.error('Manual sync failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async healthCheck(req, res) {
    try {
      const jotformHealth = await jotformService.getFormSubmissions().then(() => 'healthy').catch(() => 'unhealthy');
      const bitrix24Health = await bitrix24Service.testConnection() ? 'healthy' : 'unhealthy';

      const healthStatus = {
        service: 'jotform-bitrix24-integration',
        status: jotformHealth === 'healthy' && bitrix24Health === 'healthy' ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        components: {
          jotform: jotformHealth,
          bitrix24: bitrix24Health
        }
      };

      res.status(200).json(healthStatus);
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(500).json({
        service: 'jotform-bitrix24-integration',
        status: 'unhealthy',
        error: error.message
      });
    }
  }
}

module.exports = new FormController();