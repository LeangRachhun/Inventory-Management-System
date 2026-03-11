import connectDB from "./config/db";
import productModel from "./models/product-model";
import userModel from "./models/user-model";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import orderMedel from "./models/order-medel";

const seed = async () => {
  connectDB();
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const user = await userModel.create({
    username: "admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    address: "userAddress",
    role: "admin",
  });

  console.log(user);
  process.exit(0);
};

const orderSeed = async () => {
  try {
    connectDB();
    const users = await userModel.find({ role: "user" }).select("_id");
    const products = await productModel.find().select("_id price");
    if (!users.length || !products.length) {
      throw new Error("Users or Products collection is empty");
    }
    const orders = [];
    const startDate = new Date("2020-01-01");
    const endDate = new Date();
    for (let i = 0; i < 500; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      const randomProduct = faker.helpers.arrayElement(products);

      const quantity = faker.number.int({ min: 1, max: 5 });
      const price =
        randomProduct.price ?? faker.number.int({ min: 10, max: 200 });
      orders.push({
        user: randomUser._id,
        product: randomProduct._id,
        quantity,
        totalPrice: price * quantity,
        orderDate: faker.date.between({
          from: startDate,
          to: endDate,
        }),
      });
    }
    await orderMedel.insertMany(orders);
    console.log("🎉 Successfully seeded 300 orders (2020 → now)");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

orderSeed();
