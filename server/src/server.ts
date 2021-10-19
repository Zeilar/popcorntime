import "reflect-metadata";
import "dotenv/config";
import { join } from "path";
import express from "express";

const clientPath = join(__dirname, "../../client");

export const app = express();

app.use(express.static(clientPath));

app.get("/*", (req, res) => {
    res.sendFile(`${clientPath}\\index.html`);
});

try {
    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
} catch (error) {
    process.exit(1);
}
