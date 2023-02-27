import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

mongoose.set('strictQuery', true);

async function connect(uri?: string | undefined): Promise<void> {
  try {
    await mongoose.connect(uri || process.env.MONGO_DB_LOCAL || '');
    console.log('connected to db');
  } catch (error) {
    console.log('db connection stopped');
  }
}

export default connect;
