import { connect } from "@/dbconfig/dbConfig";
import Reminder from "@/models/reminderModel";
import { IReminder } from "@/types/reminder-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { reminderText, reminderDate, relatedTaskId, createdBy } = reqBody;

    // Create a new reminder
    const newReminder = new Reminder({
      reminderText,
      reminderDate,
      relatedTaskId,
      createdBy,
      isDone: false,
      createdAt: Date.now(),
    });

    // Save the new reminder to the database
    const savedReminder: IReminder = await newReminder.save();

    // return the new reminder
    return NextResponse.json({
      message: "New reminder saved successfully !",
      status: 200,
      success: true,
      resultObject: savedReminder,
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
