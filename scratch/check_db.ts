import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Categoria, Prenda } from './server/models';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  try {
    console.log('Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI!, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected.');
    
    const catCount = await Categoria.countDocuments();
    const prodCount = await Prenda.countDocuments();
    
    console.log('Categories:', catCount);
    console.log('Products:', prodCount);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
