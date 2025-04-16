import express from "express"
import { updateSchedule } from "../controller/scheduleController"

const router = express.Router();

router.post("/schedule", updateSchedule);

export default router;