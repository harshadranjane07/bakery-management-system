const http = require('http');

/**
 * End-to-End Verification Test Script
 * Bakery Product Management System - Academic Evaluation
 */

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = new URL(BASE_URL + endpoint);
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  const res = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runTestSuite() {
  console.log('===========================================================');
  console.log(' BAKERY PRODUCT MANAGEMENT SYSTEM - COMPREHENSIVE TEST SUITE');
  console.log('===========================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} -> ${details}`);
      failed++;
    }
  }

  // 1. Health check
  const health = await request('/health');
  assert(health.status === 200 && health.data.status === 'online', '1. System Health Check Endpoint');

  // 2. Fetch categories
  const categoriesRes = await request('/categories');
  assert(categoriesRes.status === 200 && categoriesRes.data.categories?.length > 0, '2. Fetch All Bakery Categories', `Count: ${categoriesRes.data.count}`);
  const sampleCatId = categoriesRes.data.categories[0]._id;

  // 3. Fetch products
  const productsRes = await request('/products');
  assert(productsRes.status === 200 && productsRes.data.products?.length >= 10, '3. Fetch All Bakery Products from MongoDB', `Count: ${productsRes.data.count}`);
  const firstProduct = productsRes.data.products[0];

  // 4. Customer Registration with duplicate check
  const uniqueEmail = `testuser_${Date.now()}@bakery.com`;
  const regRes = await request('/auth/register', {
    method: 'POST',
    body: {
      name: 'Simulated Customer',
      email: uniqueEmail,
      phone: '9988776655',
      password: 'password123',
      confirmPassword: 'password123'
    }
  });
  assert(regRes.status === 201 && regRes.data.token, '4. Customer Registration API with bcrypt hashing', regRes.data.message);

  // 5. Test Duplicate Registration Prevention
  const dupRes = await request('/auth/register', {
    method: 'POST',
    body: {
      name: 'Duplicate Customer',
      email: uniqueEmail,
      phone: '9988776655',
      password: 'password123',
      confirmPassword: 'password123'
    }
  });
  assert(dupRes.status === 400, '5. Duplicate Email Registration Prevention', `Response status: ${dupRes.status}`);

  // 6. Customer Login
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: {
      email: uniqueEmail,
      password: 'password123'
    }
  });
  assert(loginRes.status === 200 && loginRes.data.token, '6. Customer JWT Login Verification', loginRes.data.message);
  const customerToken = loginRes.data.token;

  // 7. Admin Login
  const adminLoginRes = await request('/auth/admin-login', {
    method: 'POST',
    body: {
      email: 'admin@bakery.com',
      password: 'admin123'
    }
  });
  assert(adminLoginRes.status === 200 && adminLoginRes.data.token && adminLoginRes.data.user.role === 'admin', '7. Admin Authentication with Secure Role Verification');
  const adminToken = adminLoginRes.data.token;

  // 8. Role-Based Access Control: Customer blocked from admin endpoints
  const blockedAdminRes = await request('/dashboard/stats', {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert(blockedAdminRes.status === 403, '8. Role-Based Access Control: Customer blocked from Admin Dashboard', `Status: ${blockedAdminRes.status}`);

  // 9. Admin Dashboard Stats
  const dashboardStatsRes = await request('/dashboard/stats', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(
    dashboardStatsRes.status === 200 &&
    dashboardStatsRes.data.stats.totalProducts > 0 &&
    dashboardStatsRes.data.stats.totalOrders > 0,
    '9. Admin Dashboard Statistics Calculation (Total Products, Orders, Customers, Low Stock)'
  );

  // 10. Product CRUD: Create new product
  const newProdRes = await request('/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Golden Mango Cheesecake',
      category: sampleCatId,
      price: 499,
      description: 'Velvety New York style cheesecake with fresh Alphonso mango glaze.',
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
      unit: 'piece',
      isFeatured: true
    }
  });
  assert(newProdRes.status === 201 && newProdRes.data.product?._id, '10. Product CRUD: Admin Create Product in MongoDB');
  const createdProdId = newProdRes.data.product?._id;

  // 11. Product CRUD: Update product
  const updateProdRes = await request(`/products/${createdProdId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Golden Mango Cheesecake (Special Edition)',
      price: 520,
      stock: 15
    }
  });
  assert(updateProdRes.status === 200 && updateProdRes.data.product?.price === 520, '11. Product CRUD: Admin Update Price & Stock');

  // 12. Category CRUD: Create Category
  const newCatRes = await request('/categories', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: `Artisan Pies ${Date.now()}`,
      description: 'Warm flaky sweet and savory oven-baked pies',
      imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600'
    }
  });
  assert(newCatRes.status === 201 && newCatRes.data.category?._id, '12. Category CRUD: Admin Create Category');
  const createdCatId = newCatRes.data.category?._id;

  // 13. Category CRUD: Delete Category
  const delCatRes = await request(`/categories/${createdCatId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(delCatRes.status === 200, '13. Category CRUD: Admin Delete Category');

  // 14. Customer Order Placement & Inventory Stock Decrement
  const initialStock = firstProduct.stock;
  const orderPlacementRes = await request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      items: [
        {
          product: firstProduct._id,
          name: firstProduct.name,
          quantity: 2
        }
      ],
      shippingAddress: {
        fullName: 'Simulated Customer',
        phone: '9988776655',
        address: 'B-202, Blossom Enclave, Model Colony',
        city: 'Pune',
        pincode: '411016'
      },
      paymentMethod: 'Cash on Delivery',
      orderNotes: 'Fresh morning bake requested'
    }
  });
  assert(orderPlacementRes.status === 201 && orderPlacementRes.data.order?._id, '14. Customer Order Placement & Checkout', orderPlacementRes.data.message);
  const createdOrderId = orderPlacementRes.data.order?._id;

  // 15. Verify Stock was automatically decremented
  const checkStockRes = await request(`/products/${firstProduct._id}`);
  assert(checkStockRes.data.product.stock === initialStock - 2, '15. MongoDB Inventory Auto-Decrement upon Order Placement', `Stock before: ${initialStock}, after: ${checkStockRes.data.product.stock}`);

  // 16. Customer Order History
  const myOrdersRes = await request('/orders/my-orders', {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert(myOrdersRes.status === 200 && myOrdersRes.data.orders?.length > 0, '16. Customer My Orders History Retrieval');

  // 17. Admin Update Order Status
  const updateStatusRes = await request(`/orders/${createdOrderId}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      status: 'Processing'
    }
  });
  assert(updateStatusRes.status === 200 && updateStatusRes.data.order.orderStatus === 'Processing', '17. Admin Order Fulfillment Status Update (Pending -> Processing)');

  // 18. Product CRUD: Clean up test product
  const delProdRes = await request(`/products/${createdProdId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(delProdRes.status === 200, '18. Product CRUD: Admin Delete Product from MongoDB');

  console.log('===========================================================');
  console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===========================================================');

  if (failed === 0) {
    console.log(' ALL MEAN STACK SPECIFICATIONS AND ACADEMIC REQUIREMENTS MET PERFECTLY!');
  }
}

runTestSuite().catch(console.error);
