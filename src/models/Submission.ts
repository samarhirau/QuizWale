import mongoose from "mongoose"

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        selectedAnswer: String,
        isCorrect: Boolean,
        timeSpent: Number, // seconds spent on this question
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    timeSpent: {
      type: Number,
      required: true, // total time in seconds
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  },
)

// Compound index for efficient leaderboard queries
submissionSchema.index({ quizId: 1, score: -1, timeSpent: 1 })
submissionSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.Submission || mongoose.model("Submission", submissionSchema)
