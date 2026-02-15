import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static dist folder
app.use(express.static(path.join(__dirname, "dist")));

// Fallback route (สำคัญมาก)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(5001, () => {
  console.log("Server running on 5001");
});
