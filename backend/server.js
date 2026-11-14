import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import opportunityRoutes from './routes/opportunityRoutes.js';

const app = express();

// Connect to the Atlas Database
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/opportunities', opportunityRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('VolunTrack API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));