
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [arrayLimit, "{PATH} must have at least 2 options"],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  explanation: {
    type: String,
    default: "",
  },
});

function arrayLimit(val: string | any[]) {
  return val.length >= 2;
}

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: Number, required: true },
    questions: [questionSchema],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 }, // ✅ ← THIS MUST EXIST
    maxAttempts: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);




export default mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
