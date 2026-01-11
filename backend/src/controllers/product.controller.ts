import { Request, Response } from "express";
import mongoose from "mongoose";

import Product from "../models/Product";

/* ----------------------------------
   GET ALL PRODUCTS
----------------------------------- */
export const getProducts = async (_req: Request, res: Response) => {
  const products = await Product.find({ isActive: true }).sort({
    createdAt: -1,
  });

  res.json(products);
};

/* ----------------------------------
   GET SINGLE PRODUCT
----------------------------------- */
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  // 🔥 1️⃣ ObjectId validation (IMPORTANT)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  // 🔥 2️⃣ Safe query
  const product = await Product.findById(id);

  // 🔥 3️⃣ Product existence check
  if (!product || !product.isActive) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
};
