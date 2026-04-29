import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Usuario } from './models.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Reviste';

async function fixUsers() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('Actualizando usuarios sin campo ES_ADMIN...');
    
    // updateMany actualiza todos los documentos que cumplen la condición
    const result = await Usuario.updateMany(
      { ES_ADMIN: { $exists: false } }, // Condición: donde ES_ADMIN no exista
      { $set: { ES_ADMIN: false } }     // Acción: ponle ES_ADMIN = false
    );
    
    console.log(`Operación completada. Se actualizaron ${result.modifiedCount} usuarios.`);
    process.exit(0);
  } catch (error) {
    console.error('Error al actualizar usuarios:', error);
    process.exit(1);
  }
}

fixUsers();
