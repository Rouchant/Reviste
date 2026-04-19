
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Prenda, Categoria } from '../server/models';

dotenv.config();

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // Find "Accesorios" category ID
  const cat = await Categoria.findOne({ NOMBRE_CATEGORIA: 'Accesorios' });
  if (!cat) {
    console.error('Accesorios category not found');
    process.exit(1);
  }

  // Update IDs 9 and 15 to be in Accesorios
  const result = await Prenda.updateMany(
    { id: { $in: [9, 15] } },
    { $set: { ID_CATEGORIA: cat.id } }
  );

  console.log(`Updated ${result.modifiedCount} products.`);
  process.exit(0);
}

fix().catch(err => {
  console.error(err);
  process.exit(1);
});
