import { Router } from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product-controller";

const router = Router();

router.get("/", getProducts);

router.post("/create", addProduct);

router.put("/update/:id", updateProduct);

router.delete("/delete/:id", deleteProduct);

export default router;
