import express from "express"
import { createNewRecord, getNormalRecord } from "../controller/generalController"

const router = express.Router();

router.post("/", createNewRecord);
router.get("/", getNormalRecord);

export default router;