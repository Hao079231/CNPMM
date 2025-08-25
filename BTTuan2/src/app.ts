import express from "express";
import type { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { UserController } from "./controller/userController.js";

const app = express();
app.use(express.json());

// Lấy __dirname chuẩn trong ESM/TS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve file tĩnh từ thư mục public (tương đối với src)
app.use(express.static(path.join(__dirname, "../src/public")));

// ================= API CRUD (prefix /api/user) =================
app.post("/api/user/create", async (req: Request, res: Response) => {
  const user = await UserController.create(req.body);
  res.json(user);
});

app.get("/api/user/list", async (_req: Request, res: Response) => {
  const users = await UserController.getAllUsers();
  res.json(users);
});

app.get("/api/user/get/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "User ID is required" });
  const user = await UserController.getUserById(id);
  res.json(user);
});

app.put("/api/user/update/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "User ID is required" });
  const result = await UserController.updateUser(id, req.body);
  res.json(result);
});

app.delete("/api/user/delete/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "User ID is required" });
  const result = await UserController.deleteUser(id);
  res.json(result);
});

// Trả về index.html cho FE khi vào / hoặc /user
app.get(["/", "/api/user"], (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../src/public", "index.html"));
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
