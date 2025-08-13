
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: true, // allow your frontend origin during dev or specify e.g. ["http://localhost:5173"]
  credentials: true, // needed for cookies
}));
app.use(express.json());
app.use(cookieParser());

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Auth Mongo connected'))
  .catch((e) => console.error('Mongo error', e));

// routes
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// health
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth service listening on ${PORT}`));
