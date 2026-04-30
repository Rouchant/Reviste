import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { 
  Categoria, Prenda, PrendaImagen, HeroSlide, Usuario, Region, Comuna, Direccion
} from './models.js';
import bcrypt from 'bcryptjs';

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

// --- GEOGRAPHY ---
app.get('/api/location/regions', async (req, res) => {
  try {
    const regions = await Region.find().sort({ id: 1 });
    res.json(regions.map(r => ({ id: r.id, name: r.NOMBRE_REGION })));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener regiones' });
  }
});

app.get('/api/location/comunas/:regionId', async (req, res) => {
  try {
    const { regionId } = req.params;
    const comunas = await Comuna.find({ ID_REGION: Number(regionId) }).sort({ NOMBRE_COMUNA: 1 });
    res.json(comunas.map(c => ({ id: c.id, name: c.NOMBRE_COMUNA })));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comunas' });
  }
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

// 2.1 Atlas Search (Búsqueda Avanzada)
app.get('/api/catalog/search', async (req, res) => {
  const { q } = req.query;
  console.log(`Búsqueda Atlas Search: ${q}`);
  
  if (!q) {
    return res.json([]);
  }

  try {
    const prendas = await Prenda.aggregate([
      {
        $search: {
          index: 'prendas', // Índice de prendas creado en Atlas
          text: {
            query: q as string,
            path: { wildcard: '*' }, // Busca en TODOS los campos de texto
            fuzzy: {
              maxEdits: 1, // Reducido a 1 para evitar demasiados "falsos positivos"
              prefixLength: 2 // Exige que al menos las 2 primeras letras coincidan (ej. "ga...")
            }
          }
        }
      },
      { $limit: 20 }
    ]);

    const prendaIds = prendas.map(p => p.id);
    
    const [images, sellers, categories] = await Promise.all([
      PrendaImagen.find({ ID_PRENDA: { $in: prendaIds } }),
      Usuario.find(),
      Categoria.find()
    ]);
    
    const imageMap = new Map(images.map(img => [img.ID_PRENDA, img.URL]));
    const sellerMap = new Map(sellers.map(s => [s.id, s.NOMBRE_USUARIO]));
    const catMap = new Map(categories.map(c => [c.id, c.NOMBRE_CATEGORIA]));

    const products = prendas.map(p => {
      const categoryName = catMap.get(p.ID_CATEGORIA) || 'Sin Categoría';
      const tags = [categoryName];
      if (p.OLD_PRICE && p.OLD_PRICE > p.PRECIO_VENTA_PUBLICO) tags.push('Oferta');
      
      return {
        id: p.id,
        name: p.NOMBRE_PRENDA,
        price: p.PRECIO_VENTA_PUBLICO,
        oldPrice: p.OLD_PRICE,
        discount: p.DISCOUNT,
        tag: tags.join(' | '),
        description: p.DESCRIPCION,
        rating: p.RATING || 0,
        reviews: p.REVIEWS_COUNT || 0,
        image: imageMap.get(p.id) || '',
        freeShipping: p.FREE_SHIPPING || false,
        seller: sellerMap.has(p.ID_USUARIO_VENDEDOR) ? `@${sellerMap.get(p.ID_USUARIO_VENDEDOR)}` : 'Reviste'
      };
    });

    res.json(products);
  } catch (error) {
    console.error('Error en Atlas Search:', error);
    res.status(500).json({ error: 'Error en la búsqueda avanzada. Verifica que el índice exista y se llame "default".' });
  }
});

// 2.2 Single Product
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
        categoryId: prenda.ID_CATEGORIA,
        talla: prenda.TALLA,
        estado: prenda.ESTADO_CONSERVACION,
        status: prenda.ESTADO_VENTA,
        rating: prenda.RATING || 0,
        reviews: prenda.REVIEWS_COUNT || 12,
        image: images[0]?.URL || '',
        images: images.map(img => img.URL),
        freeShipping: prenda.FREE_SHIPPING,
        sellerId: prenda.ID_USUARIO_VENDEDOR,
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
  if (req.body.categoryId !== undefined) updates.ID_CATEGORIA = req.body.categoryId;
  if (req.body.talla !== undefined) updates.TALLA = req.body.talla;
  if (req.body.estado !== undefined) updates.ESTADO_CONSERVACION = req.body.estado;

  console.log(`Actualizando producto ${id} con:`, updates);
  try {
    const updatedProduct = await Prenda.findOneAndUpdate(
      { id: Number(id) },
      { $set: updates },
      { new: true }
    );
    
    if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });

    // Handle Image Update if provided
    if (req.body.image) {
      await PrendaImagen.findOneAndUpdate(
        { ID_PRENDA: Number(id) },
        { URL: req.body.image },
        { upsert: true }
      );
    }

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

// --- AUTHENTICATION ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, username, phone, street, regionId, comunaId } = req.body;
    const existing = await Usuario.findOne({ CORREO: email });
    if (existing) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    let direccionId = null;
    if (street && comunaId) {
      const lastDir = await Direccion.findOne().sort({ id: -1 });
      const nextDirId = (lastDir?.id || 0) + 1;
      const nuevaDireccion = new Direccion({
        id: nextDirId,
        CALLE: street,
        ID_COMUNA: Number(comunaId)
      });
      await nuevaDireccion.save();
      direccionId = nextDirId;
    }

    const lastUser = await Usuario.findOne().sort({ id: -1 });
    const nextId = (lastUser?.id || 0) + 1;

    const newUser = new Usuario({
      id: nextId,
      ID_DIRECCION: direccionId,
      NOMBRE_USUARIO: username || (name ? name.split(' ')[0] : email.split('@')[0]),
      NOMBRE_COMPLETO: name || email.split('@')[0],
      CORREO: email,
      CONTRASENA: await bcrypt.hash(password, 10),
      TELEFONO: phone,
      ES_ADMIN: false,
      FECHA_REGISTRO: new Date()
    });

    await newUser.save();
    
    res.status(201).json({
      id: newUser.id.toString(),
      name: newUser.NOMBRE_COMPLETO,
      username: newUser.NOMBRE_USUARIO,
      email: newUser.CORREO,
      phone: newUser.TELEFONO,
      bio: newUser.BIOGRAFIA,
      street: street,
      regionId: regionId?.toString(),
      comunaId: comunaId?.toString(),
      role: newUser.ES_ADMIN ? 'admin' : 'user',
      isAdmin: newUser.ES_ADMIN,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.CORREO}`
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ CORREO: email });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = user.CONTRASENA.startsWith('$2') 
      ? await bcrypt.compare(password, user.CONTRASENA) 
      : password === user.CONTRASENA;

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const userDir = user.ID_DIRECCION ? await Direccion.findOne({ id: user.ID_DIRECCION }) : null;
    const userComuna = userDir ? await Comuna.findOne({ id: userDir.ID_COMUNA }) : null;

    res.json({
      id: user.id.toString(),
      name: user.NOMBRE_COMPLETO,
      username: user.NOMBRE_USUARIO,
      email: user.CORREO,
      phone: user.TELEFONO,
      bio: user.BIOGRAFIA,
      street: userDir?.CALLE,
      regionId: userComuna?.ID_REGION?.toString(),
      comunaId: userDir?.ID_COMUNA?.toString(),
      role: user.ES_ADMIN ? 'admin' : 'user',
      isAdmin: user.ES_ADMIN,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.CORREO}`
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, bio, phone, street, regionId, comunaId } = req.body;
    
    const updates: any = {};
    if (name !== undefined) updates.NOMBRE_COMPLETO = name;
    if (username !== undefined) updates.NOMBRE_USUARIO = username;
    if (bio !== undefined) updates.BIOGRAFIA = bio;
    if (phone !== undefined) updates.TELEFONO = phone;

    const user = await Usuario.findOne({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (street !== undefined || comunaId !== undefined) {
      if (user.ID_DIRECCION) {
        const dirUpdates: any = {};
        if (street !== undefined) dirUpdates.CALLE = street;
        if (comunaId !== undefined) dirUpdates.ID_COMUNA = Number(comunaId);
        await Direccion.findOneAndUpdate({ id: user.ID_DIRECCION }, { $set: dirUpdates });
      } else if (street && comunaId) {
        const lastDir = await Direccion.findOne().sort({ id: -1 });
        const nextDirId = (lastDir?.id || 0) + 1;
        const nuevaDireccion = new Direccion({
          id: nextDirId,
          CALLE: street,
          ID_COMUNA: Number(comunaId)
        });
        await nuevaDireccion.save();
        updates.ID_DIRECCION = nextDirId;
      }
    }

    const updatedUser = await Usuario.findOneAndUpdate(
      { id: Number(id) },
      { $set: updates },
      { new: true }
    );

    const userDir = updatedUser?.ID_DIRECCION ? await Direccion.findOne({ id: updatedUser.ID_DIRECCION }) : null;
    const userComuna = userDir ? await Comuna.findOne({ id: userDir.ID_COMUNA }) : null;

    res.json({
      id: updatedUser!.id.toString(),
      name: updatedUser!.NOMBRE_COMPLETO,
      username: updatedUser!.NOMBRE_USUARIO,
      email: updatedUser!.CORREO,
      phone: updatedUser!.TELEFONO,
      bio: updatedUser!.BIOGRAFIA,
      street: userDir?.CALLE,
      regionId: userComuna?.ID_REGION?.toString(),
      comunaId: userDir?.ID_COMUNA?.toString(),
      role: updatedUser!.ES_ADMIN ? 'admin' : 'user',
      isAdmin: updatedUser!.ES_ADMIN,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${updatedUser!.CORREO}`
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

// --- PASSWORD UPDATE ---
app.put('/api/users/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    const user = await Usuario.findOne({ id: Number(id) });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isMatch = user.CONTRASENA.startsWith('$2') 
      ? await bcrypt.compare(currentPassword, user.CONTRASENA) 
      : currentPassword === user.CONTRASENA;

    if (!isMatch) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await Usuario.findOneAndUpdate({ id: Number(id) }, { CONTRASENA: hashedNewPassword });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ error: 'Error al actualizar contraseña' });
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
