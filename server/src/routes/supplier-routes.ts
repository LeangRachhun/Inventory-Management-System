import { Router } from "express";
import {
  getSuppliers,
  addSupplier,
  updateSupllier,
  deletesupplier,
} from "../controllers/supplier-controller";

const router = Router();

router.get("/", getSuppliers);

router.post("/create", addSupplier);

router.put("/update/:id", updateSupllier);

router.delete("/delete/:id", deletesupplier);

export default router;
