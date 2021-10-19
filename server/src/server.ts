import "reflect-metadata";
import "dotenv/config";
import { join } from "path";
import express from "express";

const clientPath = join(__dirname, "../../client");
const { PORT } = process.env;

export const app = express();

app.use(express.static(clientPath));

app.get("/*", (req, res) => {
    res.sendFile(`${clientPath}\\index.html`);
});

export const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
