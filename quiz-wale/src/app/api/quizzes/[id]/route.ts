import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import Submission from "@/models/Submission";
import { getServerSession } from "@/lib/auth";

// GET - Fetch single quiz (with or without answers based on role)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const session = await getServerSession();
    const quiz = await Quiz.findById(params.id).populate("createdBy", "name");

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // If not admin, hide correct answers
    if (!session || session.role !== "admin") {
      quiz.questions = quiz.questions.map((q: any) => ({
        ...q.toObject(),
        correctAnswer: undefined,
      }));
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("GET quiz error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update quiz
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();
    await connectDB();

    const quiz = await Quiz.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Update quiz error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Remove quiz and its submissions
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const quiz = await Quiz.findByIdAndDelete(params.id);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Delete all submissions related to this quiz
    await Submission.deleteMany({ quizId: params.id });

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Delete quiz error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
