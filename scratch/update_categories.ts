
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Prenda, Categoria } from '../server/models';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // Verify category "Accesorios"
  const cat = await Categoria.findOne({ NOMBRE_CATEGORIA: 'Accesorios' });
  if (!cat) {
    console.error('Accesorios category not found');
    process.exit(1);
  }
  
  console.log('Target Category ID for Accesorios:', cat.id);

  // Update all accessories
  const ids = [6, 9, 15, 16, 17, 18, 19];
  const result = await Prenda.updateMany(
    { id: { $in: ids } },
    { $set: { ID_CATEGORIA: cat.id } }
  );

  console.log(`Updated ${result.modifiedCount} products to category ID ${cat.id}.`);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
