import { Router } from "express";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category-controller";

const router = Router();

router.get("/", getCategories);

router.post("/create", addCategory);

router.put("/update/:id", updateCategory);

router.delete("/delete/:id", deleteCategory);

export default router;
