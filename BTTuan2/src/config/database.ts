import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.URI_MONGODB;
const client = new MongoClient(uri!);
let db: Db | null = null;

export async function connectDB() {
  if (!db) {
    await client.connect();
    console.log("Đã kết nối với MongoDB Cloud");
    db = client.db(process.env.DATABASE_NAME); // tên cơ sở dữ liệu
  }
  return db;
}

export async function disconnectDB() {
  await client.close();
  console.log("Đã ngắt kết nối với MongoDB Cloud");
}