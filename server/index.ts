import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { 
  Categoria, Prenda, PrendaImagen, HeroSlide, Usuario 
} from './models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use real MongoDB from Env or fallback for local dev
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  console.error('CRÍTICO: ¡MONGODB_URI no está definido en el entorno de producción!');
}

const URI = MONGODB_URI || 'mongodb://localhost:27017/Reviste';

app.use(cors());
app.use(express.json());

// Middleware to ensure DB is connected before any request (Robust for Serverless)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      console.log('Conectando a MongoDB...');
      await mongoose.connect(URI, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB Conectado.');
    } catch (err) {
      console.error('Error de conexión a la base de datos durante la petición:', err);
      return res.status(500).json({ 
        error: 'Conexión a la base de datos fallida', 
        details: (err as Error).message,
        hint: 'Verifica MONGODB_URI en los ajustes de Vercel y la lista blanca de IPs en Atlas'
      });
    }
  }
  next();
});

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
  console.log('Obteniendo categorías...');
  try {
    const categories = await Categoria.find().sort({ id: 1 }).maxTimeMS(5000);
    console.log(`Se encontraron ${categories.length} categorías.`);
    // Map to simple array of names to match mockData.categories format
    const names = categories.map(c => c.NOMBRE_CATEGORIA);
    res.json(names);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías', details: (error as Error).message });
  }
});

// 2. Products (Prendas)
app.get('/api/catalog/products', async (req, res) => {
  console.log('Obteniendo productos...');
  try {
    const [prendas, images, sellers, categories] = await Promise.all([
      Prenda.find().lean().maxTimeMS(5000),
      PrendaImagen.find().maxTimeMS(5000),
      Usuario.find().maxTimeMS(5000),
      Categoria.find().maxTimeMS(5000)
    ]);
    console.log(`Datos obtenidos: ${prendas.length} productos, ${images.length} imágenes.`);
    
    // Create maps for quick lookup
    const imageMap = new Map(images.map(img => [img.ID_PRENDA, img.URL]));
    const sellerMap = new Map(sellers.map(s => [s.id, s.NOMBRE_USUARIO]));
    const catMap = new Map(categories.map(c => [c.id, c.NOMBRE_CATEGORIA]));

    const products = prendas.map(p => {
      const categoryName = catMap.get(p.ID_CATEGORIA) || 'Sin Categoría';
      const tags = [categoryName];
      
      // Virtual Tags for search compatibility
      if (p.OLD_PRICE && p.OLD_PRICE > p.PRECIO_VENTA_PUBLICO) tags.push('Oferta');
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      if (p.FECHA_PUBLICACION && p.FECHA_PUBLICACION > oneWeekAgo) tags.push('Nuevo');
      
      if (p.RATING && p.RATING >= 4.5) tags.push('Top');
      if (categoryName.toLowerCase().includes('accesorio') && categoryName !== 'Accesorios') tags.push('Accesorio');

      return {
        id: p.id,
        name: p.NOMBRE_PRENDA,
        price: p.PRECIO_VENTA_PUBLICO,
        oldPrice: p.OLD_PRICE,
        discount: p.DISCOUNT,
        tag: tags.join(' | '), // Joins tags with separator for robust matching in frontend
        description: p.DESCRIPCION || `Hermosa prenda de categoría ${categoryName}`,
        rating: p.RATING || 0,
        reviews: p.REVIEWS_COUNT || 0,
        image: imageMap.get(p.id) || '',
        freeShipping: p.FREE_SHIPPING || false,
        seller: sellerMap.has(p.ID_USUARIO_VENDEDOR) ? `@${sellerMap.get(p.ID_USUARIO_VENDEDOR)}` : 'Reviste'
      };
    });

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 2.1 Single Product
app.get('/api/catalog/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const prenda = await Prenda.findOne({ id: Number(id) });
    if (!prenda) return res.status(404).json({ error: 'Producto no encontrado' });

    const [images, seller, category] = await Promise.all([
      PrendaImagen.find({ ID_PRENDA: prenda.id }),
      Usuario.findOne({ id: prenda.ID_USUARIO_VENDEDOR }),
      Categoria.findOne({ id: prenda.ID_CATEGORIA })
    ]);

    const categoryName = category?.NOMBRE_CATEGORIA || 'Sin Categoría';
    const tags = [categoryName];
    if (prenda.OLD_PRICE && prenda.OLD_PRICE > prenda.PRECIO_VENTA_PUBLICO) tags.push('Oferta');
      
      res.json({
        id: prenda.id,
        name: prenda.NOMBRE_PRENDA,
        price: prenda.PRECIO_VENTA_PUBLICO,
        oldPrice: prenda.OLD_PRICE,
        discount: prenda.DISCOUNT,
        tag: tags.join(' | '),
      description: prenda.DESCRIPCION,
      rating: prenda.RATING || 0,
      reviews: prenda.REVIEWS_COUNT || 12, // fallback for UI
      image: images[0]?.URL || '',
      images: images.map(img => img.URL),
      freeShipping: prenda.FREE_SHIPPING,
      seller: seller ? `@${seller.NOMBRE_USUARIO}` : 'Reviste'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// 2.2 Create Product (New)

app.post('/api/catalog/products', async (req, res) => {
  console.log('Creando nuevo producto...');
  try {
    const { name, price, oldPrice, description, categoryId, sellerId, image, talla, estado } = req.body;
    
    // Get next ID
    const lastProduct = await Prenda.findOne().sort({ id: -1 });
    const nextId = (lastProduct?.id || 0) + 1;

    const newProduct = new Prenda({
      id: nextId,
      NOMBRE_PRENDA: name,
      PRECIO_VENTA_PUBLICO: price,
      OLD_PRICE: oldPrice,
      DESCRIPCION: description || `Prenda: ${name}`,
      ID_CATEGORIA: categoryId || 1,
      ID_USUARIO_VENDEDOR: sellerId || 10, // Default to RevisteOfficial if not provided
      FECHA_PUBLICACION: new Date(),
      ESTADO_VENTA: 'Disponible',
      TALLA: talla || 'M',
      ESTADO_CONSERVACION: estado || 'Excelente',
      RATING: 5,
      REVIEWS_COUNT: 0,
      FREE_SHIPPING: false
    });

    await newProduct.save();

    if (image) {
      const lastImg = await PrendaImagen.findOne().sort({ id: -1 });
      const nextImgId = (lastImg?.id || 0) + 1;
      
      const newImage = new PrendaImagen({
        id: nextImgId,
        ID_PRENDA: nextId,
        URL: image
      });
      await newImage.save();
    }

    console.log(`Producto creado exitosamente con ID: ${nextId}`);
    res.status(201).json({ 
      message: 'Producto creado exitosamente', 
      id: nextId,
      product: newProduct 
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto', details: (error as Error).message });
  }
});

// 2.3 Get Products by Seller
app.get('/api/catalog/products/seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;
  console.log(`Obteniendo productos del vendedor: ${sellerId}`);
  try {
    const [prendas, images] = await Promise.all([
      Prenda.find({ ID_USUARIO_VENDEDOR: Number(sellerId) }).lean(),
      PrendaImagen.find()
    ]);
    
    const imageMap = new Map(images.map(img => [img.ID_PRENDA, img.URL]));

    const products = prendas.map(p => ({
      id: p.id,
      name: p.NOMBRE_PRENDA,
      price: p.PRECIO_VENTA_PUBLICO,
      status: p.ESTADO_VENTA,
      image: imageMap.get(p.id) || ''
    }));

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos del vendedor:', error);
    res.status(500).json({ error: 'Error al obtener tus productos' });
  }
});

// 2.4 Update Product
app.put('/api/catalog/products/:id', async (req, res) => {
  const { id } = req.params;
  const updates: any = {};
  if (req.body.name !== undefined) updates.NOMBRE_PRENDA = req.body.name;
  if (req.body.price !== undefined) updates.PRECIO_VENTA_PUBLICO = req.body.price;
  if (req.body.description !== undefined) updates.DESCRIPCION = req.body.description;
  if (req.body.status !== undefined) updates.ESTADO_VENTA = req.body.status;

  console.log(`Actualizando producto ${id} con:`, updates);
  try {
    const updatedProduct = await Prenda.findOneAndUpdate(
      { id: Number(id) },
      { $set: updates },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// 2.5 Delete Product
app.delete('/api/catalog/products/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Eliminando producto: ${id}`);
  try {
    const product = await Prenda.findOneAndDelete({ id: Number(id) });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    
    // Also delete associated images
    await PrendaImagen.deleteMany({ ID_PRENDA: Number(id) });
    
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// 3. Hero Slides
app.get('/api/catalog/hero-slides', async (req, res) => {
  try {
    const slides = await HeroSlide.find().lean().sort({ id: 1 });
    const mappedSlides = slides.map(h => ({
      id: h.id,
      title: h.title,
      subtitle: h.subtitle,
      buttonText: h.buttonText,
      image: h.image,
      link: h.link || '/search'
    }));
    res.json(mappedSlides);
  } catch (error) {
    console.error('Error al obtener los hero slides:', error);
    res.status(500).json({ error: 'Error al obtener los hero slides' });
  }
});

// --- SERVER START ---

export default app;

if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`Servidor API corriendo en http://localhost:${PORT}`);
  });
  
  server.on('error', (err) => {
    console.error('Error del servidor:', err);
  });
}
