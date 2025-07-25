import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import Submission from "@/models/Submission";
import { getServerSession } from "@/lib/auth";

// Utility to extract the ID from the URL
function getIdFromUrl(request: NextRequest): string | null {
  const segments = request.nextUrl.pathname.split("/");
  return segments[segments.length - 1] || null;
}

// GET Handler — Get quiz by ID
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromUrl(request);
    if (!id) return NextResponse.json({ error: "Missing quiz ID" }, { status: 400 });

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
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = getIdFromUrl(request);
    if (!id) return NextResponse.json({ error: "Missing quiz ID" }, { status: 400 });

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
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = getIdFromUrl(request);
    if (!id) return NextResponse.json({ error: "Missing quiz ID" }, { status: 400 });

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
