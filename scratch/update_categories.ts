
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Prenda, Categoria } from '../server/models';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // Verify category "Accesorios"
  const cat = await Categoria.findOne({ NOMBRE_CATEGORIA: 'Accesorios' });
  if (!cat) {
    console.error('Categoría Accesorios no encontrada');
    process.exit(1);
  }
  
  console.log('ID de categoría objetivo para Accesorios:', cat.id);

  // Update all accessories
  const result = await Prenda.updateMany(
    { NOMBRE_PRENDA: /Accesorio/i },
    { $set: { ID_CATEGORIA: cat.id } }
  );

  console.log(`Se actualizaron ${result.modifiedCount} productos con el ID de categoría ${cat.id}.`);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
