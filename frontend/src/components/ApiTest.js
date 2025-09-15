import React from 'react';
import axios from 'axios';

const ApiTest = () => {
  const testHealth = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/health');
      console.log('Health Success:', response.data);
      alert('Health Success: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error('Health Error:', error);
      alert('Health Error: ' + error.message);
    }
  };

  const testLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: 'superadmin',
        password: '12345'
      });
      console.log('Login Success:', response.data);
      alert('Login Success: ' + JSON.stringify(response.data));
    } catch (error) {
      console.error('Login Error:', error);
      alert('Login Error: ' + error.message + ' - ' + JSON.stringify(error.response?.data));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test</h1>
      <button onClick={testHealth} style={{ margin: '10px', padding: '10px' }}>
        Test Health
      </button>
      <button onClick={testLogin} style={{ margin: '10px', padding: '10px' }}>
        Test Login
      </button>
    </div>
  );
};

export default ApiTest;