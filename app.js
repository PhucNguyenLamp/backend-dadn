import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/record", records);

app.use((err, _req, res, next) => {
    res.status(500).send("Unexpected error occured")
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
