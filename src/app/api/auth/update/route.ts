import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { password, username } = reqBody;

    // Check if username already exists
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({
        message: "User not found !",
        status: 400,
        success: false,
      });
    }

    // Hash the password
    const salt: string = await bcryptjs.genSalt(10);
    const hashedPassword: string = await bcryptjs.hash(password, salt);

    // Update Password
    user.password = hashedPassword;
    await user.save();

    // return the new user
    return NextResponse.json({
      message: "Password updated successfully !",
      status: 200,
      success: true,
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
