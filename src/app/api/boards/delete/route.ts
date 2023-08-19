import { connect } from "@/dbconfig/dbConfig";
import Board from "@/models/boardModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id } = reqBody;

    // Find the note by id
    const board = await Board.deleteOne({_id});

    if (!board) {
      return NextResponse.json({
        message: "Board not found !",
        status: 400,
        success: false,
      });
    }

    // return the updated note
    return NextResponse.json({
      message: "Board deleted successfully !",
      status: 200,
      success: true,
      resultObject: board,
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
