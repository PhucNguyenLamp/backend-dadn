import express from "express";
import db from "../db/database.js";

import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import generalRoutes from "./generalRoutes";
import logRoutes from "./logRoutes";
import userRoutes from "./userRoutes";
import deviceRoutes from "./deviceRoutes";
import scheduleRoutes from "./scheduleRoutes";

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
