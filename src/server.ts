import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import resourceRoutes from './routes/resourceRoutes';
import gameRoutes from './routes/gameRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware for CORS
const allowedOrigins = ['http://localhost:5173','https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--fc837ba8.local-credentialless.webcontainer-api.io'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Enable cookies and HTTP Auth
}));

app.use(express.json());

// Routes
app.use('/api/resources', resourceRoutes);
app.use('/api/games', gameRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
