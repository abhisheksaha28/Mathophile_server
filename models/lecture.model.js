import mongoose from "mongoose";
import { Schema } from "mongoose";


const lectureSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          video: {
            type: String, //cloudinary url
            required: true,
          },
          course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },

    }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);