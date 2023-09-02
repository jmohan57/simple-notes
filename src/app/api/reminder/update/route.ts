import { connect } from "@/dbconfig/dbConfig";
import Reminder from "@/models/reminderModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { reminderText, reminderDate, isDone, _id } = reqBody;

    // Find the reminder by id
    const reminder = await Reminder.findById(_id);

    if (!reminder) {
      return NextResponse.json({
        message: "Reminder not found !",
        status: 400,
        success: false,
      });
    }

    // Update the reminder
    reminder.reminderText = reminderText;
    reminder.reminderDate = reminderDate;
    if (isDone) {
      reminder.isDone = true;
      reminder.completedAt = Date.now();
    }
    await reminder.save();

    // return the updated note
    return NextResponse.json({
      message: "Reminder updated successfully !",
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
