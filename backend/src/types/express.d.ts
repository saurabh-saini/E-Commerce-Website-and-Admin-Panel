import { Types } from "mongoose";

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
