import express from "express";
import db from "../db/database.js";

import { ObjectId } from "mongodb";

const router = express.Router();

//-----CREATE-----//

// Create a new record
router.post("/", async (req, res) => {
    try {
        let newDocument = req.body;
        let collection = db.collection("records");

        if (!newDocument || Object.keys(newDocument).length == 0) {
            return res.status(400).send("Request cannot be empty");
        }

        let result = await collection.insertOne(newDocument);
        res.send(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add record");
    }
});

//-----RETRIEVE-----//

//Get all records
router.get("/", async (req, res) => {
    try {
        let collection = db.collection("records");
        let results = await collection.find({}).toArray();
        res.status(200).send(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch records");
    }
});

// Get a single record by ID (for now)
/* Issue, cannot get ID or name at the moment
*/
router.get("/:id", async (req, res) => {
    let collection = db.collection("records");
    let aidee = new ObjectId(req.params.id)
    let query = {_id: aidee};
    let result = await collection.findOne(query);

    if (!result){
        res.status(404).send("Record not found");
    }
    else {
        res.status(200).send(result);
    }
});

//-----UPDATE-----//

router.patch("/:id", async (req, res) => {
    try {
        let aidee = new ObjectId(req.params.id);
        const query = { _id: aidee};
        const updates = {
            $set: {
                name: req.body.name,
                age: req.body.age,
                gpa: req.body.gpa,
            },
        };

        let collection = await db.collection("records");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update record");
    }
});

//-----DELETE-----//

router.delete("/:id", async (req, res) => {
    try {
        let aidee = new ObjectId(req.params.id);
        const query = { _id: aidee };

        const collection = await db.collection("records");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete record");
    }
});

export default router;
