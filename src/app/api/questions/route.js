// src/app/api/questions/route.js
import dbConnect from "@/lib/dbConnect";
import Answer from "@/models/Answer";
import Question from "@/models/Question";
import { NextResponse } from "next/server";

// ✅ Get all questions
// ... existing imports ...

// ✅ Get all questions or a single question if id is provided
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch single question
      const question = await Question.findById(id);
      if (!question) {
        return NextResponse.json(
          { success: false, message: "Question not found" },
          { status: 404 }
        );
      }

      const answerCount = await Answer.countDocuments({ questionId: id });
      return NextResponse.json({
        success: true,
        data: { ...question.toObject(), answerCount },
      });
    } else {
      // Fetch all questions
      const questions = await Question.find({}).sort({ createdAt: -1 });

      const questionsWithAnswerCount = await Promise.all(
        questions.map(async (question) => {
          const answerCount = await Answer.countDocuments({
            questionId: question._id,
          });
          return { ...question.toObject(), answerCount };
        })
      );

      return NextResponse.json({
        success: true,
        data: questionsWithAnswerCount,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// ... rest of the code remains the same ...

// ✅ Create new question
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const question = await Question.create(body);

    return NextResponse.json(
      { success: true, data: question },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// ✅ Update question
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    const updated = await Question.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// ✅ Delete question
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );

    // Also delete related answers
    await Answer.deleteMany({ questionId: id });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
