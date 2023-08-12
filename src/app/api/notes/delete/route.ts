import { connect } from "@/dbconfig/dbConfig";
import Note from "@/models/noteModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id } = reqBody;

    // Find the note by id
    const note = await Note.deleteOne({_id});

    if (!note) {
      return NextResponse.json({
        message: "Note not found !",
        status: 400,
        success: false,
      });
    }

    // return the updated note
    return NextResponse.json({
      message: "Note deleted successfully !",
      status: 200,
      success: true,
      resultObject: note,
    });
  } catch (error) {
    return NextResponse.json({
      error: error,
      message: "Sorry, something went wrong !",
      status: 500,
      success: false,
    });
  }
}
