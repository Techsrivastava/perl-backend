// Flutter API Integration Test
// This demonstrates how the Flutter app integrates with the backend

const http = require('http');

// Simulate Flutter API calls
class FlutterAPIService {
  constructor() {
    this.baseUrl = 'http://localhost:5000/api';
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${endpoint}`;
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const req = http.request(url, options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            resolve({ statusCode: res.statusCode, data: response });
          } catch (e) {
            resolve({ statusCode: res.statusCode, data: body });
          }
        });
      });

      req.on('error', (err) => reject(err));

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async sendOTP(email) {
    console.log(`📱 Flutter App: Sending OTP request for ${email}`);
    const response = await this.makeRequest('/auth/send-otp', 'POST', { email });
    console.log(`📱 Flutter Response: ${response.statusCode}`, response.data);
    return response;
  }

  async verifyOTP(email, otp) {
    console.log(`📱 Flutter App: Verifying OTP ${otp} for ${email}`);
    const response = await this.makeRequest('/auth/verify-otp', 'POST', { email, otp });
    console.log(`📱 Flutter Response: ${response.statusCode}`, response.data);
    return response;
  }
}

// Test Flutter-Backend Integration
async function testFlutterBackendIntegration() {
  console.log('🔗 Testing Flutter-Backend OTP Integration...\n');

  const flutterAPI = new FlutterAPIService();

  try {
    // Step 1: Flutter app sends OTP request
    console.log('📱 Step 1: User enters email and taps "Send OTP"');
    const sendOTPResponse = await flutterAPI.sendOTP('test@example.com');

    if (sendOTPResponse.statusCode === 200 && sendOTPResponse.data.success) {
      console.log('✅ OTP sent successfully from backend\n');

      // Step 2: User receives OTP (in real app, this would come via email)
      console.log('📱 Step 2: User receives OTP via email');
      console.log('📧 [Check backend console for OTP code]\n');

      // Step 3: User enters OTP and taps verify
      console.log('📱 Step 3: User enters OTP and taps "Verify"');
      // Note: In real testing, replace '1234' with actual OTP from backend logs
      const verifyOTPResponse = await flutterAPI.verifyOTP('test@example.com', '1234');

      if (verifyOTPResponse.statusCode === 200 && verifyOTPResponse.data.success) {
        console.log('✅ OTP verified successfully - User logged in!\n');

        // Step 4: App receives JWT token and user data
        const { token, user } = verifyOTPResponse.data.data;
        console.log('🎫 JWT Token received:', token.substring(0, 20) + '...');
        console.log('👤 User data:', user);

        console.log('\n🎉 COMPLETE FLUTTER-BACKEND INTEGRATION SUCCESSFUL!');
      } else {
        console.log('❌ OTP verification failed:', verifyOTPResponse.data.message);
      }
    } else {
      console.log('❌ OTP send failed:', sendOTPResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Integration test error:', error.message);
  }
}

// Export for testing
module.exports = { FlutterAPIService, testFlutterBackendIntegration };

// Run test if called directly
if (require.main === module) {
  testFlutterBackendIntegration();
}
