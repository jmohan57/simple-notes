import { connect } from "@/dbconfig/dbConfig";
import Reminder from "@/models/reminderModel";
import { IReminder } from "@/types/reminder-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { createdBy } = reqBody;

    const reminders: IReminder[] = await Reminder.find({ createdBy });

    // return the fetched reminders
    return NextResponse.json({
      message: "Notes fetched successfully !",
      status: 200,
      success: true,
      resultObject: reminders,
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
