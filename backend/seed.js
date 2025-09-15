import "dotenv/config";
import mongoose from "mongoose";
import productModel from "./models/productModel.js";
import userModel from "./models/userModel.js";
import categoryModel from "./models/categoryModel.js";
import orderModel from "./models/orderModel.js";

const seedProducts = [
  {
    name: "Chair",
    description: "Comfortable wooden chair",
    category: "Furniture",
    subCategory: "Seating",
    colors: ["Brown", "Black"],
    quantity: 10,
    image: [],
  },
  {
    name: "Table",
    description: "Dining table for six",
    category: "Furniture",
    subCategory: "Table",
    colors: ["White"],
    quantity: 5,
    image: [],
  },
];

const seedUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    phone: "1234567890",
  },
];

const seedCategories = [
  { name: "Furniture", date: Date.now() },
  { name: "Electronics", date: Date.now() },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await productModel.deleteMany();
    await userModel.deleteMany();
    await categoryModel.deleteMany();
    await orderModel.deleteMany();

    await productModel.insertMany(seedProducts);
    await userModel.insertMany(seedUsers);
    await categoryModel.insertMany(seedCategories);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedDatabase();
