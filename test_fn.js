const { handler } = require('./backend/netlify/functions/api');

async function test() {
  const event = {
    httpMethod: 'GET',
    path: '/.netlify/functions/api/stats',
    headers: {},
    queryStringParameters: {}
  };
  
  const context = {};
  
  const res = await handler(event, context);
  console.log('STATUS:', res.statusCode);
  console.log('BODY:', res.body);
}

test();
