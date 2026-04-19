import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Categoria, Prenda, HeroSlide } from '../server/models';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  try {
    console.log('Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI!, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected.');
    
    const heroCount = await HeroSlide.countDocuments();
    console.log('HeroSlides count:', heroCount);
    
    if (heroCount > 0) {
      const sampleHero = await HeroSlide.findOne().lean();
      console.log('Sample HeroSlide Data:', JSON.stringify(sampleHero, null, 2));
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
