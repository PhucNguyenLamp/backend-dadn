import express from "express"
import { getDeviceData, setDeviceAutomation, setDeviceStatus } from "../controller/deviceController.js"

const router = express.Router();

router.get("/:device", getDeviceData);
router.post("/automation", setDeviceAutomation);
router.post("/device_status", setDeviceStatus);

export default router;