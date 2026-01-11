import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/", (_req, res) => {
  res.send("API is running...");
});

export default app;
