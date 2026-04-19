import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { 
  Categoria, Prenda, PrendaImagen, HeroSlide, Usuario 
} from './models';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Reviste';

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// --- ROUTES ---

// 1. Categories
app.get('/api/catalog/categories', async (req, res) => {
  console.log('Fetching categories...');
  try {
    const categories = await Categoria.find().sort({ id: 1 }).maxTimeMS(5000);
    console.log(`Found ${categories.length} categories.`);
    // Map to simple array of names to match mockData.categories format
    const names = categories.map(c => c.NOMBRE_CATEGORIA);
    res.json(names);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories', details: (error as Error).message });
  }
});

// 2. Products (Prendas)
app.get('/api/catalog/products', async (req, res) => {
  console.log('Fetching products...');
  try {
    const [prendas, images, sellers, categories] = await Promise.all([
      Prenda.find().maxTimeMS(5000),
      PrendaImagen.find().maxTimeMS(5000),
      Usuario.find().maxTimeMS(5000),
      Categoria.find().maxTimeMS(5000)
    ]);
    console.log(`Fetched data: ${prendas.length} products, ${images.length} images.`);
    console.log(`Fetched data: ${prendas.length} products, ${images.length} images.`);
    
    // Create maps for quick lookup
    const imageMap = new Map(images.map(img => [img.ID_PRENDA, img.URL]));
    const sellerMap = new Map(sellers.map(s => [s.id, s.NOMBRE_USUARIO]));
    const catMap = new Map(categories.map(c => [c.id, c.NOMBRE_CATEGORIA]));

    const products = prendas.map(p => ({
      id: p.id,
      name: p.NOMBRE_PRENDA,
      price: p.PRECIO_VENTA_PUBLICO,
      oldPrice: p.OLD_PRICE,
      discount: p.DISCOUNT,
      tag: catMap.get(p.ID_CATEGORIA) || 'Sin Tag',
      rating: p.RATING || 0,
      reviews: p.REVIEWS_COUNT || 0,
      image: imageMap.get(p.id) || '',
      freeShipping: p.FREE_SHIPPING || false,
      seller: sellerMap.has(p.ID_USUARIO_VENDEDOR) ? `@${sellerMap.get(p.ID_USUARIO_VENDEDOR)}` : 'Reviste'
    }));

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// 3. Hero Slides
app.get('/api/catalog/hero-slides', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ id: 1 });
    res.json(slides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    res.status(500).json({ error: 'Error fetching hero slides' });
  }
});

// --- SERVER START ---

export default app;

if (process.env.NODE_ENV !== 'production') {
  async function start() {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      console.log('API conectada a MongoDB (Local).');
      app.listen(PORT, () => {
        console.log(`Servidor API corriendo en http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Error al iniciar el servidor:', error);
    }
  }

  start();
} else {
  // In production (Vercel), we connect on demand or at the top level
  // Mongoose handles connection buffering automatically
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .catch(err => console.error('MongoDB connection error:', err));
}
