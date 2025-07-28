import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Quiz from "@/models/Quiz"
import Submission from "@/models/Submission"
import User from "@/models/User"
import { getServerSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get("quizId")

    if (quizId) {
      // Get statistics for a specific quiz
      const quiz = await Quiz.findById(quizId)
      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
      }

      const submissions = await Submission.find({ quizId }).populate("userId", "name email").sort({ createdAt: -1 })

      // Calculate question-wise statistics
      const questionStats = quiz.questions.map((question: any, index: number) => {
        const questionSubmissions = submissions.map((s) => s.answers[index]).filter(Boolean)
        const totalAnswers = questionSubmissions.length
        const correctAnswers = questionSubmissions.filter((a) => a.isCorrect).length

        // Count answers for each option
        const optionCounts = question.options.map((option: string) => {
          const count = questionSubmissions.filter((a) => a.selectedAnswer === option).length
          return {
            option,
            count,
            percentage: totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0,
          }
        })

        return {
          questionIndex: index,
          questionText: question.questionText,
          correctAnswer: question.correctAnswer,
          totalAnswers,
          correctAnswers,
          correctPercentage: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
          optionCounts,
          averageTimeSpent: questionSubmissions.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / totalAnswers || 0,
        }
      })

      const stats = {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          totalQuestions: quiz.questions.length,
        },
        overview: {
          totalParticipants: submissions.length,
          averageScore: submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length || 0,
          averagePercentage: submissions.reduce((sum, s) => sum + s.percentage, 0) / submissions.length || 0,
          averageTimeSpent: submissions.reduce((sum, s) => sum + s.timeSpent, 0) / submissions.length || 0,
          highestScore: Math.max(...submissions.map((s) => s.score), 0),
          lowestScore: Math.min(...submissions.map((s) => s.score), 0),
        },
        questionStats,
        recentSubmissions: submissions.slice(0, 10).map((s) => ({
          id: s._id,
          user: s.userId,
          score: s.score,
          percentage: s.percentage,
          timeSpent: s.timeSpent,
          completedAt: s.completedAt,
        })),
      }

      return NextResponse.json(stats)
    } else {
      // Get overall platform statistics
      const [totalUsers, totalQuizzes, totalSubmissions] = await Promise.all([
        User.countDocuments(),
        Quiz.countDocuments(),
        Submission.countDocuments(),
      ])

      const recentSubmissions = await Submission.find()
        .populate("userId", "name")
        .populate("quizId", "title")
        .sort({ createdAt: -1 })
        .limit(10)

      const topQuizzes = await Submission.aggregate([
        {
          $group: {
            _id: "$quizId",
            totalSubmissions: { $sum: 1 },
            averageScore: { $avg: "$score" },
            averagePercentage: { $avg: "$percentage" },
          },
        },
        {
          $lookup: {
            from: "quizzes",
            localField: "_id",
            foreignField: "_id",
            as: "quiz",
          },
        },
        { $unwind: "$quiz" },
        {
          $project: {
            title: "$quiz.title",
            category: "$quiz.category",
            totalSubmissions: 1,
            averageScore: { $round: ["$averageScore", 1] },
            averagePercentage: { $round: ["$averagePercentage", 1] },
          },
        },
        { $sort: { totalSubmissions: -1 } },
        { $limit: 5 },
      ])

      const stats = {
        overview: {
          totalUsers,
          totalQuizzes,
          totalSubmissions,
          averageQuizzesPerUser: totalUsers > 0 ? Math.round(totalSubmissions / totalUsers) : 0,
        },
        topQuizzes,
        recentSubmissions: recentSubmissions.map((s) => ({
          id: s._id,
          user: s.userId,
          quiz: s.quizId,
          score: s.score,
          percentage: s.percentage,
          completedAt: s.completedAt,
        })),
      }

      return NextResponse.json(stats)
    }
  } catch (error) {
    console.error("Statistics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
