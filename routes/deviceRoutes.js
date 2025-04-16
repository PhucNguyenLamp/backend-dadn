import express from "express"
import { getDeviceData, setDeviceAutomation, setDeviceStatus } from "../controller/deviceController"

const router = express.Router();

router.get("/:device", getDeviceData);
router.get("/automation", setDeviceAutomation);
router.post("/device_status", setDeviceStatus);

export default router;