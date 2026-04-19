import app from '../server/index';

// Canary endpoint - if this works, the problem is deeper in the logic
app.get('/api/canary', (req, res) => {
  res.json({ status: 'alive', environment: process.env.NODE_ENV });
});

export default app;
