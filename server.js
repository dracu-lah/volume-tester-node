import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Serve static files
app.use("/uploads", express.static(uploadDir));

// View - upload & list
app.get("/", (req, res) => {
  const files = fs.readdirSync(uploadDir);
  res.send(`
    <h2>Upload File</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
    </form>
    <h2>Uploaded Files</h2>
    <ul>
      ${files
        .map(
          (file) =>
            `<li><a href="/uploads/${file}" target="_blank">${file}</a></li>`,
        )
        .join("")}
    </ul>
  `);
});

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
