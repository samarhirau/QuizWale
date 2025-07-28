

import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Quiz from "@/models/Quiz"
import { getServerSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const filter: any = { isActive: true }
    if (category) filter.category = category
    if (difficulty) filter.difficulty = difficulty

    const quizzes = await Quiz.find(filter)
      .populate("createdBy", "name")
      .select("-questions.correctAnswer") // Hide correct answers
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await Quiz.countDocuments(filter)

    return NextResponse.json({
      quizzes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get quizzes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    // console.log("Session in POST /api/quizzes:", session)

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quizData = await request.json()

    await connectDB()

    const quiz = await Quiz.create({
      ...quizData,
      createdBy: session.userId,
    })

    return NextResponse.json({ quiz }, { status: 201 })
  } catch (error) {
    console.error("Create quiz error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

