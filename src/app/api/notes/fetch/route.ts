import { connect } from "@/dbconfig/dbConfig";
import Note from "@/models/noteModel";
import { NoteInterface } from "@/types/note-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { createdBy } = reqBody;

    const notes: NoteInterface[] = await Note.find({ createdBy });

    // return the new note
    return NextResponse.json({
      message: "Notes fetched successfully !",
      status: 200,
      success: true,
      resultObject: notes,
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
