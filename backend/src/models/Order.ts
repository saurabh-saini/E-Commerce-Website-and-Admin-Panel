import mongoose, { Schema, Document, Types } from "mongoose";

/* ===============================
   ORDER ITEM TYPE
================================ */
interface OrderItem {
  product: Types.ObjectId | string;
  name: string;
  price: number;
  quantity: number;
}

/* ===============================
   SHIPPING ADDRESS TYPE
================================ */
interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

/* ===============================
   ORDER INTERFACE
================================ */
export interface IOrder extends Document {
  user: Types.ObjectId;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;

  paymentStatus: "pending" | "paid";
  paidAt?: Date; // ✅ FIX 1

  orderStatus: "placed" | "shipped" | "delivered" | "cancelled"; // ✅ FIX 2

  createdAt: Date;
  updatedAt: Date;
}

/* ===============================
   ORDER SCHEMA
================================ */
const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paidAt: {
      type: Date, // ✅ FIX 1
    },

    orderStatus: {
      type: String,
      enum: ["placed", "shipped", "delivered", "cancelled"],
      default: "placed", // ✅ FIX 2
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
