import express, { Request, Response, Router } from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth-route";
import categoryRoutes from "./routes/category-route";
import supplierRoutes from "./routes/supplier-routes";
import productRoutes from "./routes/product-route";
import handleError from "./middlewares/error-middlewares";
import orderRoutes from "./routes/order-route";
import verifyJWT from "./middlewares/auth-middlewares";
import userRoutes from "./routes/user-route";
import dashboardRoutes from "./routes/dashboard-toute";
import reportRoutes from "./routes/report-route";

//Database connection
connectDB();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send({ status: "healthy" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", verifyJWT, categoryRoutes);
app.use("/api/v1/supplier", verifyJWT, supplierRoutes);
app.use("/api/v1/product", verifyJWT, productRoutes);
app.use("/api/v1/order", verifyJWT, orderRoutes);
app.use("/api/v1/user", verifyJWT, userRoutes);
app.use("/api/v1/dashboard", verifyJWT, dashboardRoutes);
app.use("/api/v1/report", verifyJWT, reportRoutes);

// handle error
app.use(handleError);

app.listen(process.env.PORT, async () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
