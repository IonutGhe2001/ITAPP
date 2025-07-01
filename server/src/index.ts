import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { authenticate } from "./middlewares/authMiddleware";
import echipamenteRoutes from "./routes/echipamente";
import angajatiRoutes from "./routes/angajati";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/echipamente", authenticate, echipamenteRoutes);
app.use("/api/angajati", authenticate, angajatiRoutes);

app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "Acces autorizat!",
    user: (req as any).user, 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));