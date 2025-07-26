// import { type NextRequest, NextResponse } from "next/server"
// import connectDB from "@/lib/mongodb"
// import Submission from "@/models/Submission"
// import { getServerSession } from "@/lib/auth"
// import mongoose from "mongoose"

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const session = await getServerSession()

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     await connectDB()

//     // Find the submission and populate the quiz details
//     const submission = await Submission.findById(params.id).populate("quizId")

//     if (!submission) {
//       return NextResponse.json({ error: "Submission not found" }, { status: 404 })
//     }

//     // Ensure quizId is populated and is a valid Quiz document
//     if (!submission.quizId || typeof submission.quizId === "string") {
//       return NextResponse.json({ error: "Quiz data not found for this submission" }, { status: 500 })
//     }

//     // Determine access rights
//     const isOwner = submission.userId.toString() === session.userId
//     const isAdmin = session.role === "admin"
//     const quizResultsReleased = (submission.quizId as any).resultsReleased || false // Overall quiz release
//     const individualSubmissionReleased = submission.isReleased || false // Individual submission release

//     // Access control logic:
//     // Allow access if:
//     // 1. The user is the owner of the submission, OR
//     // 2. The user is an admin, OR
//     // 3. The quiz's overall results have been released, OR
//     // 4. This specific submission's results have been individually released.
//     if (!isOwner && !isAdmin && !quizResultsReleased && !individualSubmissionReleased) {
//       return NextResponse.json({ error: "Forbidden: Results not yet released for this quiz" }, { status: 403 })
//     }

//     // Prepare response data
//     const responseData = {
//       submission: {
//         id: submission._id,
//         score: submission.score,
//         percentage: submission.percentage,
//         totalQuestions: submission.totalQuestions,
//         timeSpent: submission.timeSpent,
//         completedAt: submission.completedAt,
//       },
//       quiz: {
//         id: (submission.quizId as any)._id,
//         title: (submission.quizId as any).title,
//         questions: (submission.quizId as any).questions.map((q: any, index: number) => ({
//           questionText: q.questionText,
//           options: q.options,
//           correctAnswer: q.correctAnswer, // Include correct answer for review
//           userAnswer: submission.answers[index]?.selectedAnswer,
//           isCorrect: submission.answers[index]?.isCorrect,
//           explanation: q.explanation,
//         })),
//       },
//     }

//     return NextResponse.json(responseData)
//   } catch (error) {
//     console.error("Get submission error:", error)
//     if (error instanceof mongoose.Error.CastError) {
//       return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 })
//     }
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Submission from "@/models/Submission"
import { getServerSession } from "@/lib/auth"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: any) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Find the submission and populate the quiz details
    const submission = await Submission.findById(params.id).populate("quizId")

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    // Ensure quizId is populated and is a valid Quiz document
    if (!submission.quizId || typeof submission.quizId === "string") {
      return NextResponse.json({ error: "Quiz data not found for this submission" }, { status: 500 })
    }

    // Determine access rights
    const isOwner = submission.userId.toString() === session.userId
    const isAdmin = session.role === "admin"
    const quizResultsReleased = (submission.quizId as any).resultsReleased || false
    const individualSubmissionReleased = submission.isReleased || false

    if (!isOwner && !isAdmin && !quizResultsReleased && !individualSubmissionReleased) {
      return NextResponse.json({ error: "Forbidden: Results not yet released for this quiz" }, { status: 403 })
    }

    // Prepare response data
    const responseData = {
      submission: {
        id: submission._id,
        score: submission.score,
        percentage: submission.percentage,
        totalQuestions: submission.totalQuestions,
        timeSpent: submission.timeSpent,
        completedAt: submission.completedAt,
      },
      quiz: {
        id: (submission.quizId as any)._id,
        title: (submission.quizId as any).title,
        questions: (submission.quizId as any).questions.map((q: any, index: number) => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          userAnswer: submission.answers[index]?.selectedAnswer,
          isCorrect: submission.answers[index]?.isCorrect,
          explanation: q.explanation,
        })),
      },
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Get submission error:", error)
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
