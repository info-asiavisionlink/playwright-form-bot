const express = require('express');
const app = express();

// 🔥 ここが重要
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
