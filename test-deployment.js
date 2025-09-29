// Test script to verify backend deployment
async function testBackendDeployment() {
  const baseUrl = 'https://smart-attendance-qk5b.onrender.com';
  
  console.log('🚀 Testing Smart Attendance Backend Deployment...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: API info
    console.log('\n2️⃣ Testing API info endpoint...');
    const infoResponse = await fetch(`${baseUrl}/`);
    const infoData = await infoResponse.json();
    console.log('✅ API info:', infoData);
    
    // Test 3: Login endpoint
    console.log('\n3️⃣ Testing admin login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@smartattend.com',
        password: 'Admin123!'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Admin login successful');
      console.log('Token received:', loginData.token ? 'Yes' : 'No');
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Admin login failed:', errorData.message);
    }
    
    console.log('\n🎉 Backend deployment test completed!');
    
  } catch (error) {
    console.error('❌ Error testing backend:', error.message);
  }
}

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  testBackendDeployment();
}

export default testBackendDeployment;