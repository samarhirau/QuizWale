import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Quiz from "@/models/Quiz"
import Submission from "@/models/Submission"
import User from "@/models/User"
import { getServerSession } from "@/lib/auth"


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {

  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { answers, timeSpent } = await request.json()

    await connectDB()

    const quiz = await Quiz.findById(params.id)
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const existingSubmissionsCount = await Submission.countDocuments({
      userId: session.userId,
      quizId: params.id,
    })

    if (existingSubmissionsCount >= quiz.maxAttempts) {
      return NextResponse.json(
        { error: `You have already reached the maximum number of attempts (${quiz.maxAttempts}) for this quiz.` },
        { status: 400 }
      )
    }

    let correctAnswers = 0
    const detailedAnswers = answers.map((answer: any, index: number) => {
      const question = quiz.questions[index]
      const isCorrect = question.correctAnswer === answer.selectedAnswer
      if (isCorrect) correctAnswers++

      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0,
      }
    })

    const score = correctAnswers
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100)

    const submission = await Submission.create({
      userId: session.userId,
      quizId: params.id,
      answers: detailedAnswers,
      score,
      percentage,
      totalQuestions: quiz.questions.length,
      timeSpent,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    await User.findByIdAndUpdate(session.userId, {
      $inc: {
        totalScore: score,
        quizzesCompleted: 1,
      },
    })

    return NextResponse.json({
      message: "Quiz submitted successfully!",
      submissionId: submission._id,
    })
  } catch (error) {
    console.error("Submit quiz error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
