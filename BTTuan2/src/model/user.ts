import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}
