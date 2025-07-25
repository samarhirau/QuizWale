import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import Submission from "@/models/Submission";
import { getServerSession } from "@/lib/auth";

// GET Handler — Get quiz by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const session = await getServerSession();

    const quiz = await Quiz.findById(id).populate("createdBy", "name");
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (!session || session.role !== "admin") {
      quiz.questions = quiz.questions.map((q: any) => ({
        ...q.toObject(),
        correctAnswer: undefined,
      }));
    }

    return NextResponse.json({ quiz }, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT Handler — Update quiz by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const updates = await request.json();

    await connectDB();
    const quiz = await Quiz.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ quiz }, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE Handler — Delete quiz by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await connectDB();

    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    await Submission.deleteMany({ quizId: id });

    return NextResponse.json({ message: "Quiz deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
