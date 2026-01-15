import mongoose, { Schema, Document, Types } from "mongoose";

/* ===============================
   ORDER ITEM TYPE
================================ */

interface OrderItem {
  product: Types.ObjectId;
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

  paymentStatus: "pending" | "paid" | "failed";

  paymentId?: Types.ObjectId;

  paidAt?: Date;

  orderStatus:
    | "placed"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

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
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },

    paidAt: {
      type: Date,
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "placed",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", orderSchema);
