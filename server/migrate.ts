import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { 
  Region, Comuna, Direccion, Usuario, Categoria, 
  Prenda, PrendaImagen, HeroSlide 
} from './models';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Reviste';

async function migrate() {
  try {
    console.log('--- Inicia Migración ---');
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB.');

    // Leer mockData.json
    const mockDataPath = new URL('../src/data/mockData.json', import.meta.url).pathname;
    // On Windows, the pathname might start with /C:/, which fs doesn't like sometimes.
    const normalizedPath = mockDataPath.startsWith('/') && mockDataPath[2] === ':' ? mockDataPath.slice(1) : mockDataPath;
    
    const rawData = fs.readFileSync(normalizedPath, 'utf8');
    const data = JSON.parse(rawData);

    // Limpiar colecciones involucradas
    await Promise.all([
      Region.deleteMany({}),
      Comuna.deleteMany({}),
      Direccion.deleteMany({}),
      Usuario.deleteMany({}),
      Categoria.deleteMany({}),
      Prenda.deleteMany({}),
      PrendaImagen.deleteMany({}),
      HeroSlide.deleteMany({})
    ]);
    console.log('Colecciones limpiadas.');

    // 1. REGION y COMUNA (Datos base para soportar direcciones)
    const regionMetrop = await Region.create({ id: 13, NOMBRE_REGION: 'Metropolitana' });
    const comunaSantiago = await Comuna.create({ id: 13101, ID_REGION: 13, NOMBRE_COMUNA: 'Santiago' });
    const direccionBase = await Direccion.create({ id: 1, CALLE: 'Av. Providencia 1234', ID_COMUNA: 13101 });
    console.log('Datos geográficos base creados.');

    // 2. CATEGORIAS
    // Mapeo inicial de nombres a IDs
    const categoryMap: { [name: string]: number } = {};
    const categoriesToInsert = data.categories.map((name: string, index: number) => {
      const id = index + 1;
      categoryMap[name.toLowerCase()] = id;
      return { id, NOMBRE_CATEGORIA: name };
    });
    // Agregar categorías que aparecen en tags pero no en la lista principal si las hay (ej. 'Cargo', 'Accesorio')
    // Normalizaremos los tags de los productos para que coincidan con las categorías
    await Categoria.insertMany(categoriesToInsert);
    console.log(`Insertadas ${categoriesToInsert.length} categorías.`);

    // 3. USUARIOS (Sellers)
    const uniqueSellers = new Set<string>();
    data.newArrivals.forEach((p: any) => { if (p.seller) uniqueSellers.add(p.seller); });
    
    // Vendedor por defecto para featuredOffers que no tienen seller explícito
    uniqueSellers.add('@RevisteOfficial');

    const sellerMap: { [name: string]: number } = {};
    let sellerIdCounter = 10;
    const usersToInsert = Array.from(uniqueSellers).map((handle: string) => {
      const id = sellerIdCounter++;
      sellerMap[handle] = id;
      return {
        id,
        ID_DIRECCION: 1,
        NOMBRE_USUARIO: handle.replace('@', ''),
        NOMBRE_COMPLETO: `Seller ${handle}`,
        CORREO: `${handle.replace('@', '').toLowerCase()}@reviste.cl`,
        CONTRASENA: 'hashed_password_placeholder',
        TELEFONO: '+56900000000',
        FECHA_REGISTRO: new Date(),
        ES_ADMIN: handle === '@RevisteOfficial'
      };
    });
    await Usuario.insertMany(usersToInsert);
    console.log(`Insertados ${usersToInsert.length} usuarios (vendedores).`);

    // 4. PRENDAS
    const allProducts = [...data.featuredOffers, ...data.newArrivals];
    const prendasToInsert: any[] = [];
    const imagenesToInsert: any[] = [];
    let imgIdCounter = 1;

    allProducts.forEach((p: any) => {
      // Determinar ID_CATEGORIA basado en tag
      let catId = 1; // Default
      if (p.tag) {
        const lowerTag = p.tag.toLowerCase();
        // Intentar match parcial
        const foundCatId = categoriesToInsert.find((c: any) => 
          c.NOMBRE_CATEGORIA.toLowerCase().includes(lowerTag) || lowerTag.includes(c.NOMBRE_CATEGORIA.toLowerCase())
        )?.id;
        if (foundCatId) catId = foundCatId;
      }

      const sellerId = p.seller ? sellerMap[p.seller] : sellerMap['@RevisteOfficial'];

      prendasToInsert.push({
        id: p.id,
        NOMBRE_PRENDA: p.name,
        ID_USUARIO_VENDEDOR: sellerId,
        ID_CATEGORIA: catId,
        FECHA_PUBLICACION: new Date(),
        DESCRIPCION: `Prenda categorizada como ${p.tag || 'Clásica'}`,
        ESTADO_VENTA: 'Disponible',
        TALLA: 'M', // Placeholder
        PRECIO_VENTA_PUBLICO: p.price,
        ESTADO_CONSERVACION: 'Excelente',
        OLD_PRICE: p.oldPrice || null,
        DISCOUNT: p.discount || null,
        RATING: p.rating || 0,
        REVIEWS_COUNT: typeof p.reviews === 'number' ? p.reviews : 0,
        FREE_SHIPPING: p.freeShipping || false
      });

      if (p.image) {
        imagenesToInsert.push({
          id: imgIdCounter++,
          ID_PRENDA: p.id,
          URL: p.image
        });
      }
    });

    await Prenda.insertMany(prendasToInsert);
    await PrendaImagen.insertMany(imagenesToInsert);
    console.log(`Insertadas ${prendasToInsert.length} prendas y ${imagenesToInsert.length} imágenes.`);

    // 5. HERO SLIDES
    const heroSlidesToInsert = data.heroSlides.map((s: any) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      buttonText: s.buttonText,
      image: s.image
    }));
    await HeroSlide.insertMany(heroSlidesToInsert);
    console.log(`Insertados ${heroSlidesToInsert.length} hero slides.`);

    console.log('--- Migración Completada Exitosamente ---');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

migrate();
