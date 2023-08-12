import { connect } from "@/dbconfig/dbConfig";
import Note from "@/models/noteModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { noteTitle, noteBody, createdBy, colorTheme, _id } = reqBody;

    // Find the note by id
    const note = await Note.findById(_id);

    if (!note) {
      return NextResponse.json({
        message: "Note not found !",
        status: 400,
        success: false,
      });
    }

    // Update the note
    note.noteTitle = noteTitle;
    note.noteBody = noteBody;
    note.createdBy = createdBy;
    note.colorTheme = colorTheme;
    note.lastEditedOn = Date.now();
    await note.save();

    // return the updated note
    return NextResponse.json({
      message: "Note updated successfully !",
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
