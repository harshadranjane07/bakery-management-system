// Environment Configuration for Bakery Product Management System
// Automatically determines backend API URL based on runtime host:
// - If running on port 4200 (Angular dev-server), proxies to local Express backend on :5000
// - In production/hosted mode (Render, Railway, Vercel, unified port 5000), uses relative '/api'
export const environment = {
  production: false,
  apiUrl:
    typeof window !== 'undefined' && window.location.port === '4200'
      ? 'http://localhost:5000/api'
      : '/api'
};
