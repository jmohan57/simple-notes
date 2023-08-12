import { connect } from "@/dbconfig/dbConfig";
import Note from "@/models/noteModel";
import { NoteInterface } from "@/types/note-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { noteTitle, noteBody, createdBy, colorTheme } = reqBody;

    // Create a new note
    const newNote = new Note({
      noteTitle,
      noteBody,
      createdBy,
      colorTheme,
      lastEditedOn: Date.now(),
    });

    // Save the new note to the database
    const savedNote: NoteInterface = await newNote.save();

    // return the new note
    return NextResponse.json({
      message: "New note saved successfully !",
      status: 200,
      success: true,
      resultObject: savedNote,
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
