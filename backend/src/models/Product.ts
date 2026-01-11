import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isActive: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
