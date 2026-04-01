'use strict';
const express = require('express');
const cors    = require('cors');
const routes  = require('./routes/index');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.text({ limit: '2mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now()-start}ms)`));
  next();
});

app.use('/api/v1', routes);
app.get('/', (req, res) => res.redirect('/api/v1'));
app.use((err, req, res, next) => res.status(500).json({ success: false, error: 'Internal server error' }));

app.listen(PORT, () => console.log(`\nToolpad API → http://localhost:${PORT}/api/v1\n`));
module.exports = app;
