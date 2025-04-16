import express from "express";
import generalRoutes from "./generalRoutes.js";
import logRoutes from "./logRoutes.js";
import userRoutes from "./userRoutes.js";
import deviceRoutes from "./deviceRoutes.js";
import scheduleRoutes from "./scheduleRoutes.js";

const router = express.Router();

// Create a new record
// and Get all records
router.use(generalRoutes);

// retrieve logs and statistics
router.use(logRoutes);

// add middleware that logs a route name when used
router.use((req, res, next) => {
    console.log("Route accessed:", req.originalUrl);
    next();
}
);

// post login
router.use(userRoutes);

//set device status
//set automation
//and retrieve device statistics
router.use(deviceRoutes);

//set schedule for device
router.use(scheduleRoutes);

export default router;
