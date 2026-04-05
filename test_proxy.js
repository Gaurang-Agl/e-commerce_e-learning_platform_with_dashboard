const { handler } = require('./ecommerce-website/netlify/functions/proxy');

async function test() {
  const event = {
    httpMethod: 'GET',
    path: '/api/products',
    headers: {}
  };
  
  process.env.SHARED_API_URL = 'http://localhost:5000/api'; // Using localhost for test
  
  console.log("Invoking proxy...");
  try {
    const res = await handler(event);
    console.log('STATUS:', res.statusCode);
    
    // Check if the response body is JSON
    if (res.body && res.body.startsWith('[')) {
      console.log('BODY HEAD:', res.body.substring(0, 100)); // print first 100 chars
    } else {
      console.log('BODY:', res.body);
    }
  } catch (e) {
    console.error(e);
  }
}

test();
