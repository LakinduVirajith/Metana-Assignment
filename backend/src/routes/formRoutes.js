import express from "express";
import { submitFormWithFile } from "../controllers/formController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/submit", upload.single("cv"), submitFormWithFile);

export default router;
