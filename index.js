const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('OK');
});

app.post('/submit', (req, res) => {
  console.log('受信:', req.body);
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('🔥 Server running on http://localhost:3000');
});
