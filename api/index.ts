import express from 'express';
const app = express();

app.get('/api/canary', (req, res) => {
  res.json({ 
    status: 'minimal-alive', 
    node: process.version,
    env: process.env.NODE_ENV 
  });
});

export default app;
