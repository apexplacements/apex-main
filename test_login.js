const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      email: 'srikanth.po@apexplacements.in',
      password: 'Srikanth@12#*'
    });
    console.log('Login Response:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('Role returned:', response.data.data?.role);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testLogin();
