import { connect } from "@/dbconfig/dbConfig";
import Reminder from "@/models/reminderModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id } = reqBody;

    // Find the reminder by id
    const reminder = await Reminder.deleteOne({ _id });

    if (!reminder) {
      return NextResponse.json({
        message: "Reminder not found !",
        status: 400,
        success: false,
      });
    }

    // return the updated note
    return NextResponse.json({
      message: "Reminder deleted successfully !",
      status: 200,
      success: true,
      resultObject: reminder,
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
