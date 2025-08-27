// src/app/api/answers/route.js
import dbConnect from "@/lib/dbConnect";
import Answer from "@/models/Answer";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");

    const answers = await Answer.find({ questionId }).sort({ answeredAt: -1 });
    return NextResponse.json({ success: true, data: answers });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const answer = await Answer.create(body);
    return NextResponse.json({ success: true, data: answer }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// ✅ Edit answer
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, answerText } = body;

    const updatedAnswer = await Answer.findByIdAndUpdate(
      id,
      { answerText },
      { new: true }
    );

    if (!updatedAnswer) {
      return NextResponse.json({ success: false, message: "Answer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedAnswer });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// ✅ Delete answer
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const deletedAnswer = await Answer.findByIdAndDelete(id);

    if (!deletedAnswer) {
      return NextResponse.json({ success: false, message: "Answer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedAnswer });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
