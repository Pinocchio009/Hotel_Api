import { Document, Model, model, Schema } from "mongoose";

export interface IRoom extends Document {
  name: string;
  RoomType: "big" | "small";
  price: number;
  role: "guest" | "admin";
}

const HotelSchema = new Schema<IRoom>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    RoomType: {
      type: String,
      enum: ["big", "small"],
      default: "small",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["guest", "admin"],
      default: "guest",
    },
  },
  { timestamps: true }
);

const RoomModel: Model<IRoom> = model<IRoom>("rooms", HotelSchema);

export default RoomModel;
