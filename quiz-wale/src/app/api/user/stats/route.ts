

import { NextResponse } from "next/server"
 import { getServerSession } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import Quiz from "@/models/Quiz"
import Submission from "@/models/Submission"

export async function GET() {
  await connectDB()

  const session = await getServerSession()

  const participants = await User.countDocuments()
  const totalQuizzes = await Quiz.countDocuments()
  const totalSubmissions = await Submission.countDocuments()

  // Default stat values
  let totalScore = 0
  let averageScore = 0
  let rank = 0
  let recentSubmissions = []

  if (session) {
    const userSubmissions = await Submission.find({ userId: session.userId }).sort({ createdAt: -1 }).limit(5)
    recentSubmissions = userSubmissions

    totalScore = userSubmissions.reduce((acc: any, curr: { score: any }) => acc + curr.score, 0)
    averageScore = userSubmissions.length > 0 ? totalScore / userSubmissions.length : 0

    // Fetch scores of all users and rank
    const allUserScores = await Submission.aggregate([
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
        },
      },
      { $sort: { totalScore: -1, _id: 1 } }, 
    ])

    rank = allUserScores.findIndex((u: { _id: { toString: () => any } }) => u._id.toString() === session.userId) + 1
  }

  return NextResponse.json({
    participants,
    totalQuizzes,
    totalSubmissions,
    totalScore,
    averageScore,
    rank,
    recentSubmissions,
  })
}

