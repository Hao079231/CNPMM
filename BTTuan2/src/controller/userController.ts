import { connectDB } from '../config/database.js';
import type { User } from '../model/user.js';
import { ObjectId } from 'mongodb';

export class UserController {
  constructor() {
    connectDB();
  }

  static async create(User: User) {
    const db = await connectDB();
    return await db.collection('users').insertOne(User);
  }

  static async getAllUsers() {
    const db = await connectDB();
    return await db.collection('users').find().toArray();
  }

  static async getUserById(id: string) {
    const db = await connectDB();
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
  }

  static async updateUser(id: string, user: Partial<User>) {
    const db = await connectDB();
    return await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: user });
  }

  static async deleteUser(id: string) {
    const db = await connectDB();
    return await db.collection('users').deleteOne({ _id: new ObjectId(id) });
  }
}