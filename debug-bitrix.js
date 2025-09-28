require('dotenv').config();
const axios = require('axios');

async function debugBitrix24() {
    console.log('🔍 Debug Bitrix24 Connection...\n');
    
    // 1. Kiểm tra biến môi trường
    console.log('1. Checking environment variables:');
    console.log('   BITRIX24_WEBHOOK_URL:', process.env.BITRIX24_WEBHOOK_URL);
    console.log('   URL exists:', !!process.env.BITRIX24_WEBHOOK_URL);
    console.log('   URL length:', process.env.BITRIX24_WEBHOOK_URL?.length);
    
    if (!process.env.BITRIX24_WEBHOOK_URL) {
        console.log('❌ BITRIX24_WEBHOOK_URL is missing in .env file');
        return;
    }

    // 2. Test kết nối cơ bản
    console.log('\n2. Testing basic connection:');
    try {
        const testUrl = `${process.env.BITRIX24_WEBHOOK_URL}crm.contact.fields`;
        console.log('   Testing URL:', testUrl);
        
        const response = await axios.get(testUrl, { 
            timeout: 15000,
            validateStatus: function (status) {
                return status < 500; // Resolve only if status code < 500
            }
        });
        
        console.log('   ✅ Response received');
        console.log('   Status:', response.status);
        console.log('   Status Text:', response.statusText);
        
        if (response.data && response.data.error) {
            console.log('   ❌ Bitrix24 API Error:', response.data.error);
            console.log('   Error Description:', response.data.error_description);
        } else {
            console.log('   ✅ Bitrix24 API working - no errors in response');
            console.log('   Response keys:', Object.keys(response.data).slice(0, 5));
        }
        
    } catch (error) {
        console.log('   ❌ Connection failed');
        console.log('   Error type:', error.code);
        console.log('   Error message:', error.message);
        
        if (error.response) {
            // Server responded with error status
            console.log('   HTTP Status:', error.response.status);
            console.log('   Status Text:', error.response.statusText);
            console.log('   Error Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            // No response received
            console.log('   No response received from server');
            console.log('   Possible causes:');
            console.log('   - Domain does not exist');
            console.log('   - Network connection issue');
            console.log('   - Firewall blocking request');
        }
    }

    // 3. Test tạo contact thử
    console.log('\n3. Testing contact creation:');
    try {
        const contactUrl = `${process.env.BITRIX24_WEBHOOK_URL}crm.contact.add`;
        console.log('   Contact URL:', contactUrl);
        
        const contactData = {
            fields: {
                NAME: "Test User Debug",
                EMAIL: [{ VALUE: "debug@test.com", VALUE_TYPE: "WORK" }],
                PHONE: [{ VALUE: "0912345678", VALUE_TYPE: "WORK" }]
            }
        };
        
        const response = await axios.post(contactUrl, contactData, {
            timeout: 15000,
            validateStatus: function (status) {
                return status < 500;
            }
        });
        
        console.log('   ✅ Contact test request sent');
        console.log('   Status:', response.status);
        
        if (response.data) {
            if (response.data.result) {
                console.log('   ✅ Contact created successfully!');
                console.log('   Contact ID:', response.data.result);
            } else if (response.data.error) {
                console.log('   ❌ Contact creation failed:');
                console.log('   Error:', response.data.error);
                console.log('   Description:', response.data.error_description);
            }
        }
        
    } catch (error) {
        console.log('   ❌ Contact test failed:', error.message);
    }
}

debugBitrix24();