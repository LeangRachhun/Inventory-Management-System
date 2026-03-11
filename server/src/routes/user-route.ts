import { Router } from "express";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getUser,
} from "../controllers/user-controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);

router.post("/create", addUser);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

export default router;
