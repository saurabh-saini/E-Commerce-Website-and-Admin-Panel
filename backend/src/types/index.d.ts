import { Types } from "mongoose";

/* ======================================
   Extend Express Request Interface
====================================== */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: Types.ObjectId | string;
        email?: string;
        role?: string;
      };
    }
  }
}

export {};
