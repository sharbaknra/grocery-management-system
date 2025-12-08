const fetch = require('node-fetch');
(async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'purchasing@grocery.com', password: 'purchasing123' })
    });
    const login = await loginRes.json();
    if (!login.token) {
      console.error('Login failed:', login);
      process.exit(1);
    }
    const reorderRes = await fetch('http://localhost:5000/api/suppliers/reorder', {
      headers: { Authorization: 'Bearer ' + login.token }
    });
    const data = await reorderRes.json();
    console.log('status', reorderRes.status);
    console.dir(data, { depth: 5 });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
