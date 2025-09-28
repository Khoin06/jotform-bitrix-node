const config = {
  jotform: {
    apiKey: process.env.JOTFORM_API_KEY,
    baseURL: 'https://api.jotform.com',
    formId: process.env.JOTFORM_FORM_ID
  },
  bitrix24: {
    webhookUrl: process.env.BITRIX24_WEBHOOK_URL,
    contactEndpoint: 'crm.contact.add'
  },
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  }
};

// Validate required environment variables
const requiredEnvVars = [
  'JOTFORM_API_KEY',
  'JOTFORM_FORM_ID', 
  'BITRIX24_WEBHOOK_URL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

module.exports = config;