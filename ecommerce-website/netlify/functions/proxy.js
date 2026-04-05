/**
 * API Wrapper for Ecommerce Site
 * This serverless function obscures the true backend API URL.
 * It intercepts all frontend `/api/` calls and proxy-forwards them 
 * using the SHARED_API_URL environment variable.
 */

export const handler = async (event) => {
  // Extract path parameters from the original requested route
  // E.g., if /api/products, event.path is /api/products so we remove /api
  const apiPath = event.path.replace('/api', '');
  const targetUrl = process.env.SHARED_API_URL || 'http://localhost:5000/api';
  
  // Construct the absolute remote URL
  const fetchUrl = `${targetUrl}${apiPath}`;

  try {
    const response = await fetch(fetchUrl, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        // Pass essential headers through (optional, customize as needed)
        ...(event.headers['authorization'] && { 'Authorization': event.headers['authorization'] })
      },
      // Pass the body if method is POST, PUT, etc.
      body: ['GET', 'HEAD'].includes(event.httpMethod) ? undefined : event.body,
    });

    // We can parse the remote response and funnel it back
    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    };
  } catch (error) {
    console.error('Proxy Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', message: error.message }),
    };
  }
};
