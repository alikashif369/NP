import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import { startStatsUpdateJob } from './jobs/updateProductStats';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure helmet but allow cross-origin resource loads for images and other assets
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
// Configure CORS to allow multiple frontend URLs
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests, or file:// protocol)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port
    if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
      return callback(null, true);
    }
    
    // Allow file:// protocol for local HTML files
    if (origin.startsWith('file://')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static images with proper decoding for spaces in filenames
// Use the same origin logic as the main CORS middleware so we don't return a wildcard origin when credentials are enabled
const imagesOriginChecker = (origin: any, callback: any) => {
  // Allow requests with no origin (local files, curl, etc.)
  if (!origin) return callback(null, true);

  // Allow localhost on any port
  if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
    return callback(null, true);
  }

  // Allow file:// protocol for local HTML files
  if (origin.startsWith('file://')) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  } else {
    console.log(`CORS blocked origin for images: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  }
};

app.use('/images', cors({ origin: imagesOriginChecker, credentials: true, methods: ['GET'], allowedHeaders: ['Content-Type'] }), (req, res, next) => {
  // Decode the URL to handle spaces and special characters
  req.url = decodeURIComponent(req.url);
  next();
}, express.static(path.join(__dirname, '../Images'), {
  // Add cache headers and other options
  maxAge: '1d',
  etag: false
}));

// Also serve images at /backend/Images path to match frontend expectations
app.use('/backend/Images', cors({ origin: imagesOriginChecker, credentials: true, methods: ['GET'], allowedHeaders: ['Content-Type'] }), (req, res, next) => {
  // Decode the URL to handle spaces and special characters
  req.url = decodeURIComponent(req.url);
  next();
}, express.static(path.join(__dirname, '../Images'), {
  // Add cache headers and other options
  maxAge: '1d',
  etag: false
}));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Image test route
app.get('/test-images', (req, res) => {
  const fs = require('fs');
  const testImagePath = path.join(__dirname, '../Images/kojic jpgs/1ST.jpg');
  const imagesDir = path.join(__dirname, '../Images');
  
  res.json({
    success: true,
    testImageExists: fs.existsSync(testImagePath),
    testImagePath,
    imagesDir,
    imagesDirExists: fs.existsSync(imagesDir),
    sampleFolders: fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : []
  });
});

// Database test route to check products and images
app.get('/test-db', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const productCount = await prisma.product.count();
    const imageCount = await prisma.productImage.count();
    
    const sampleProduct = await prisma.product.findFirst({
      include: {
        images: true,
        category: true
      }
    });
    
    res.json({
      success: true,
      productCount,
      imageCount,
      sampleProduct: sampleProduct ? {
        id: sampleProduct.id,
        name: sampleProduct.name,
        slug: sampleProduct.slug,
        category: sampleProduct.category?.name,
        images: sampleProduct.images.map((img: any) => ({
          id: img.id,
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder
        }))
      } : null
    });
    
    await prisma.$disconnect();
  } catch (error: any) {
    console.error('Database test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CORS test endpoint
app.get('/cors-test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start background job for updating product stats
  startStatsUpdateJob();
});
