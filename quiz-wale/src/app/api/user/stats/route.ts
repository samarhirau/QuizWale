import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Submission from "@/models/Submission"
import { getServerSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get user's submissions
    const submissions = await Submission.find({ userId: session.userId })
      .populate("quizId", "title category")
      .sort({ createdAt: -1 })

    // Calculate stats
    const totalSubmissions = submissions.length
    const totalScore = submissions.reduce((sum, s) => sum + s.score, 0)
    const averageScore = totalSubmissions > 0 ? Math.round((totalScore / totalSubmissions) * 100) / 100 : 0

    // Get recent submissions (last 5)
    const recentSubmissions = submissions.slice(0, 5).map((s) => ({
      id: s._id,
      quiz: s.quizId,
      score: s.score,
      percentage: s.percentage,
      timeSpent: s.timeSpent,
      completedAt: s.completedAt,
    }))

    // Calculate rank (simplified - in production you'd want to cache this)
    const allUserScores = await Submission.aggregate([
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
        },
      },
      { $sort: { totalScore: -1 } },
    ])

    const userRank = allUserScores.findIndex((u) => u._id.toString() === session.userId) + 1

    const stats = {
      totalScore,
      averageScore,
      rank: userRank || 0,
      recentSubmissions,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("User stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
