import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Quiz from "@/lib/models/Quiz"
import Submission from "@/lib/models/Submission"
import User from "@/lib/models/User"
import { getServerSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { answers, timeSpent } = await request.json()

    await connectDB()

    // Get quiz with correct answers
    const quiz = await Quiz.findById(params.id)
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Check if user already submitted (if maxAttempts is 1)
    if (quiz.maxAttempts === 1) {
      const existingSubmission = await Submission.findOne({
        userId: session.userId,
        quizId: params.id,
      })

      if (existingSubmission) {
        return NextResponse.json({ error: "Quiz already submitted" }, { status: 400 })
      }
    }

    // Calculate score
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

    // Create submission
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

    // Update user stats
    await User.findByIdAndUpdate(session.userId, {
      $inc: {
        totalScore: score,
        quizzesCompleted: 1,
      },
    })

    // Return results with correct answers
    const results = {
      submission: {
        id: submission._id,
        score,
        percentage,
        totalQuestions: quiz.questions.length,
        timeSpent,
        completedAt: submission.completedAt,
      },
      quiz: {
        title: quiz.title,
        questions: quiz.questions.map((q: any, index: number) => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          userAnswer: answers[index]?.selectedAnswer,
          isCorrect: detailedAnswers[index].isCorrect,
          explanation: q.explanation,
        })),
      },
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Submit quiz error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
