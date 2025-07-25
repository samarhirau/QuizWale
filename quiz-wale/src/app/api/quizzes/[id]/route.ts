import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";


// GET a quiz by ID
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = context.params;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE a quiz by ID
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = context.params;
  const body = await request.json();

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, body, { new: true });
    if (!updatedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(updatedQuiz);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE a quiz by ID
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { id } = context.params;

  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Quiz deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
