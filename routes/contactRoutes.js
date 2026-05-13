import express from "express";
import {
  submitContact,
  listContacts,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitContact);

router.get("/", protect, adminOnly, listContacts);
router.put("/:id/status", protect, adminOnly, updateContactStatus);
router.delete("/:id", protect, adminOnly, deleteContact);

export default router;
