import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import { UserInterface } from "@/types/user-interface";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { fullname, username, password } = reqBody;

    // Check if username already exists
    const user = await User.findOne({ username });

    if (user) {
      return NextResponse.json({
        message: "Username already exist, try another username !",
        status: 400,
        success: false,
      });
    }

    // Hash the password
    const salt: string = await bcryptjs.genSalt(10);
    const hashedPassword: string = await bcryptjs.hash(password, salt);

    // Create a new user
    const newUser = new User({ fullname, username, password: hashedPassword });

    // Save the new user to the database
    const savedUser: UserInterface = await newUser.save();

    // return the new user
    return NextResponse.json({
      message: "Account created successfully !",
      status: 200,
      success: true,
      resultObject: {
        fullname: savedUser.fullname,
        username: savedUser.username,
        updatedOn: savedUser.updatedOn,
      },
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
