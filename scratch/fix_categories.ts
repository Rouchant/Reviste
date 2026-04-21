
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Prenda, Categoria } from '../server/models';

dotenv.config();

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // Find "Accesorios" category ID
  const cat = await Categoria.findOne({ NOMBRE_CATEGORIA: 'Accesorios' });
  if (!cat) {
    console.error('Categoría Accesorios no encontrada');
    process.exit(1);
  }

  try {
    const result = await Prenda.updateMany(
      { NOMBRE_PRENDA: /Accesorio/i },
      { $set: { ID_CATEGORIA: cat.id } }
    );

    console.log(`Se actualizaron ${result.modifiedCount} productos.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

fix().catch(err => {
  console.error(err);
  process.exit(1);
});
