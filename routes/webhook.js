const express = require('express');
const formController = require('../src/controllers/formController');
const logger = require('../src/utils/logger');

const router = express.Router();

// Jotform webhook endpoint
router.post('/jotform', formController.processWebhook);

// Manual sync endpoint for testing
router.post('/sync', formController.manualSync);

// Health check endpoint
router.get('/health', formController.healthCheck);

// Log all webhook requests
router.use((req, res, next) => {
  logger.info('Webhook route accessed', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});

module.exports = router;