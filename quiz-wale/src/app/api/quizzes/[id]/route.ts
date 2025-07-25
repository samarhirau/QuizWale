import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";

// GET a quiz by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const quiz = await Quiz.findById(params.id);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: String(error) }, { status: 500 });
  }
}

// UPDATE a quiz by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const data = await request.json();
    const updatedQuiz = await Quiz.findByIdAndUpdate(params.id, data, { new: true });

    if (!updatedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(updatedQuiz);
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: String(error) }, { status: 500 });
  }
}

// DELETE a quiz by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(params.id);
    if (!deletedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: String(error) }, { status: 500 });
  }
}
