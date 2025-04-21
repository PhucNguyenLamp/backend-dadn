import express from "express"
import { getLogs, getStatistics } from "../controller/logController.js"

const router = express.Router();

router.get("/logs", getLogs);
router.get("/statistics", getStatistics);

export default router;