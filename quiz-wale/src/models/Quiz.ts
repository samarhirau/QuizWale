import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
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
})

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // in seconds
    },
    questions: [questionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags: [String],
    maxAttempts: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Quiz || mongoose.model("Quiz", quizSchema)
