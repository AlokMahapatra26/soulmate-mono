// Load environment variables FIRST before any imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import musicRoutes from './routes/music.js';

const app = express();
const PORT = process.env.PORT || 4000;

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
}));
app.use(express.json());

// Routes - only music (search, stream, lyrics, download)
app.use('/api/music', musicRoutes);

// Health check
app.get("/health", (_, res) => {
    res.status(200).json({ message: "OK", timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
    console.log(`Soulmate Server is running on port ${PORT}`)
})