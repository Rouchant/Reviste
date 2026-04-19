import app from '../server/index.js';

// Canary endpoint - if this works, the problem is deeper in the logic
app.get('/api/canary', (req, res) => {
  res.json({ 
    status: 'alive', 
    environment: process.env.NODE_ENV,
    node: process.version
  });
});

export default app;
