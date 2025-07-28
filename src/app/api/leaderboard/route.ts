import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Submission from "@/models/Submission"
import mongoose from "mongoose" 

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "all-time" // weekly, monthly, all-time
    const quizId = searchParams.get("quizId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Calculate date filter
    let dateFilter = {}
    const now = new Date()

    if (period === "weekly") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      dateFilter = { createdAt: { $gte: weekAgo } }
    } else if (period === "monthly") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      dateFilter = { createdAt: { $gte: monthAgo } }
    }

    // Build match filter for submissions
    const matchFilter: any = { ...dateFilter }
    if (quizId) {
      matchFilter.quizId = new mongoose.Types.ObjectId(quizId) // Ensure ObjectId for quizId
    }

    // Aggregation pipeline for leaderboard
    const pipeline: mongoose.PipelineStage[] = [
      { $match: matchFilter },
      {
        $lookup: {
          from: "quizzes", // The name of the quizzes collection
          localField: "quizId",
          foreignField: "_id",
          as: "quizInfo",
        },
      },
      { $unwind: { path: "$quizInfo" } },
      {
        $group: {
          _id: "$userId",
          bestScore: { $max: "$score" },
          bestPercentage: { $max: "$percentage" },
          totalScore: { $sum: "$score" },
          averageScore: { $avg: "$score" },
          totalQuizzes: { $sum: 1 },
          bestTime: { $min: "$timeSpent" },
          averageTime: { $avg: "$timeSpent" },
          lastSubmission: { $max: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user" } },
      {
        $project: {
          userId: "$_id",
          name: "$user.name",
          email: "$user.email",
          avatar: "$user.avatar",
          bestScore: 1,
          bestPercentage: 1,
          totalScore: 1,
          averageScore: { $round: ["$averageScore", 1] },
          totalQuizzes: 1,
          bestTime: 1,
          averageTime: { $round: ["$averageTime", 0] },
          lastSubmission: 1,
        },
      },
      { $sort: { bestScore: -1, bestTime: 1 } },
      { $limit: limit },
    ]

    const leaderboard = await Submission.aggregate(pipeline)

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))

    return NextResponse.json({
      leaderboard: rankedLeaderboard,
      period,
      quizId,
    })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
