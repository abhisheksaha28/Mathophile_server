import { Schema } from "mongoose";
import mongoose from "mongoose";


const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
            unique: true,
          },
          password: {
            type: String,
            required: true,
          },
          role: {
            type: String,
            default: "user",
          },
          //how many courses taken by user
          subscription: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Courses",
            },
          ],

    },
    {
        timestamps: true,
      }
)


export const User = mongoose.model("User", userSchema);
    
     