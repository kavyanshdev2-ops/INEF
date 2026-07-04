import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

function requireEnv(value, name) {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

const uri = requireEnv(
  process.env.MONGODB_URI || 'mongodb+srv://ineffablerunner_db_user:CBqUKT0NmkQ136i3@cluster0.iap5vqp.mongodb.net/?appName=Cluster0',
  'MONGODB_URI',
);

export async function connectDb() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  return mongoose.connect(uri);
}
