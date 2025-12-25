/**
 * Cookie Authentication E2E Test
 * Tests the complete cookie-based authentication flow
 * 
 * Prerequisites:
 * 1. Server running on http://localhost:5000
 * 2. USE_COOKIES=true in .env
 * 3. Admin user seeded (run: node src/scripts/seed-admin.js)
 * 
 * Usage: node test-cookie-auth.js
 */

import http from 'http';

const BASE_URL = 'localhost';
const PORT = 5000;

// Helper to make HTTP requests and capture cookies
function makeRequest(method, path, body = null, cookies = []) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // Add cookies if provided
    if (cookies.length > 0) {
      options.headers['Cookie'] = cookies.join('; ');
    }

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = data ? JSON.parse(data) : {};
          const setCookies = res.headers['set-cookie'] || [];
          resolve({
            statusCode: res.statusCode,
            data: parsedData,
            cookies: setCookies,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: data,
            cookies: res.headers['set-cookie'] || [],
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Extract cookie value from Set-Cookie header
function extractAuthCookie(setCookieHeaders) {
  if (!setCookieHeaders || setCookieHeaders.length === 0) {
    return null;
  }
  
  const authCookie = setCookieHeaders.find(cookie => 
    cookie.startsWith('auth_token=')
  );
  
  if (!authCookie) {
    return null;
  }
  
  // Parse cookie attributes
  const parts = authCookie.split(';');
  const tokenPart = parts[0];
  
  const attributes = {
    value: tokenPart,
    httpOnly: authCookie.includes('HttpOnly'),
    secure: authCookie.includes('Secure'),
    sameSite: authCookie.includes('SameSite=Strict') ? 'Strict' : 
              authCookie.includes('SameSite=Lax') ? 'Lax' : 
              authCookie.includes('SameSite=None') ? 'None' : null
  };
  
  return attributes;
}

async function runTests() {
  console.log('🧪 Starting Cookie Authentication E2E Tests\n');
  console.log('=' .repeat(60));
  
  let testsPassed = 0;
  let testsFailed = 0;
  let authCookie = null;

  try {
    // TEST 1: Health Check
    console.log('\n📋 TEST 1: Health Check');
    console.log('-'.repeat(60));
    try {
      const health = await makeRequest('GET', '/health');
      if (health.statusCode === 200) {
        console.log('✅ Server is running');
        console.log(`   Database: ${health.data.database}`);
        testsPassed++;
      } else {
        console.log('❌ Server health check failed');
        testsFailed++;
      }
    } catch (e) {
      console.log('❌ Cannot connect to server. Make sure it\'s running on port 5000');
      console.log(`   Error: ${e.message}`);
      testsFailed++;
      return;
    }

    // TEST 2: Login and Receive Cookie
    console.log('\n📋 TEST 2: Login with Cookie Authentication');
    console.log('-'.repeat(60));
    try {
      const loginData = {
        email: 'admin@example.com',
        password: 'admin123'
      };
      
      console.log(`   Attempting login with: ${loginData.email}`);
      const loginResponse = await makeRequest('POST', '/api/auth/login', loginData);
      
      if (loginResponse.statusCode === 200) {
        const cookieData = extractAuthCookie(loginResponse.cookies);
        
        if (cookieData) {
          console.log('✅ Login successful - Cookie received');
          console.log(`   Cookie value: ${cookieData.value}`);
          console.log(`   HttpOnly: ${cookieData.httpOnly ? '✅' : '❌'}`);
          console.log(`   Secure: ${cookieData.secure ? '✅' : '⚠️  (Expected in production)'}`);
          console.log(`   SameSite: ${cookieData.sameSite || 'Not set'}`);
          
          authCookie = [cookieData.value];
          
          // Verify cookie attributes
          if (cookieData.httpOnly) {
            console.log('   ✅ Cookie is HttpOnly (secure against XSS)');
            testsPassed++;
          } else {
            console.log('   ❌ Cookie is NOT HttpOnly (security risk!)');
            testsFailed++;
          }
        } else {
          console.log('❌ Login successful but no auth_token cookie received');
          console.log('   Check USE_COOKIES=true in .env');
          testsFailed++;
        }
      } else {
        console.log(`❌ Login failed with status: ${loginResponse.statusCode}`);
        console.log(`   Response: ${JSON.stringify(loginResponse.data, null, 2)}`);
        testsFailed++;
      }
    } catch (e) {
      console.log(`❌ Login test error: ${e.message}`);
      testsFailed++;
    }

    // TEST 3: Access Protected Route with Cookie
    if (authCookie) {
      console.log('\n📋 TEST 3: Access Protected Route with Cookie');
      console.log('-'.repeat(60));
      try {
        const meResponse = await makeRequest('GET', '/api/auth/me', null, authCookie);
        
        if (meResponse.statusCode === 200) {
          console.log('✅ Successfully accessed protected route with cookie');
          console.log(`   User: ${meResponse.data.user.name}`);
          console.log(`   Email: ${meResponse.data.user.email}`);
          console.log(`   Role: ${meResponse.data.user.role}`);
          testsPassed++;
        } else {
          console.log(`❌ Failed to access protected route: ${meResponse.statusCode}`);
          console.log(`   Response: ${JSON.stringify(meResponse.data, null, 2)}`);
          testsFailed++;
        }
      } catch (e) {
        console.log(`❌ Protected route test error: ${e.message}`);
        testsFailed++;
      }

      // TEST 4: Access Protected Route WITHOUT Cookie
      console.log('\n📋 TEST 4: Access Protected Route WITHOUT Cookie (Should Fail)');
      console.log('-'.repeat(60));
      try {
        const unauthorizedResponse = await makeRequest('GET', '/api/auth/me', null, []);
        
        if (unauthorizedResponse.statusCode === 401) {
          console.log('✅ Correctly rejected request without cookie');
          console.log(`   Error: ${unauthorizedResponse.data.error}`);
          testsPassed++;
        } else {
          console.log(`❌ Should have rejected request but got: ${unauthorizedResponse.statusCode}`);
          testsFailed++;
        }
      } catch (e) {
        console.log(`❌ Unauthorized test error: ${e.message}`);
        testsFailed++;
      }

      // TEST 5: Logout and Clear Cookie
      console.log('\n📋 TEST 5: Logout and Clear Cookie');
      console.log('-'.repeat(60));
      try {
        const logoutResponse = await makeRequest('POST', '/api/auth/logout', null, authCookie);
        
        if (logoutResponse.statusCode === 200) {
          const clearCookie = logoutResponse.cookies.find(c => 
            c.includes('auth_token=') && c.includes('Max-Age=0')
          );
          
          if (clearCookie) {
            console.log('✅ Logout successful - Cookie cleared');
            console.log(`   Set-Cookie: ${clearCookie}`);
            testsPassed++;
          } else {
            console.log('⚠️  Logout successful but cookie not explicitly cleared');
            testsPassed++;
          }
        } else {
          console.log(`❌ Logout failed with status: ${logoutResponse.statusCode}`);
          testsFailed++;
        }
      } catch (e) {
        console.log(`❌ Logout test error: ${e.message}`);
        testsFailed++;
      }

      // TEST 6: Verify Cookie No Longer Works After Logout
      console.log('\n📋 TEST 6: Verify Cookie Invalid After Logout');
      console.log('-'.repeat(60));
      try {
        const afterLogout = await makeRequest('GET', '/api/auth/me', null, authCookie);
        
        if (afterLogout.statusCode === 401) {
          console.log('✅ Cookie correctly invalidated after logout');
          testsPassed++;
        } else {
          console.log(`❌ Cookie still working after logout: ${afterLogout.statusCode}`);
          testsFailed++;
        }
      } catch (e) {
        console.log(`❌ Post-logout test error: ${e.message}`);
        testsFailed++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Tests Passed: ${testsPassed}`);
    console.log(`❌ Tests Failed: ${testsFailed}`);
    console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
    
    if (testsFailed === 0) {
      console.log('\n🎉 All tests passed! Cookie authentication is working correctly.\n');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
    }

    // Configuration Check
    console.log('='.repeat(60));
    console.log('⚙️  CONFIGURATION CHECKLIST');
    console.log('='.repeat(60));
    console.log('In your .env file, verify:');
    console.log('  □ USE_COOKIES=true');
    console.log('  □ JWT_SECRET is set (at least 32 characters)');
    console.log('  □ NODE_ENV=development (or production)');
    console.log('\nIn production, also ensure:');
    console.log('  □ HTTPS is enabled (required for Secure cookies)');
    console.log('  □ FRONTEND_URL matches your actual frontend domain');
    console.log('');

  } catch (e) {
    console.log(`\n❌ Test suite error: ${e.message}`);
    console.log(e.stack);
  }
}

// Run the tests
console.log('🚀 Cookie Authentication Test Suite');
console.log('Make sure your server is running on http://localhost:5000\n');

runTests().catch(console.error);