import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import { ITokenData } from "@/types/token-data-interface";
import { UserInterface } from "@/types/user-interface";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;

    // Check if username does not exists
    const user: UserInterface | null = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({
        message: "Invalid Username !",
        status: 400,
        success: false,
      });
    }

    // Check the password
    const validPassword: boolean = await bcryptjs.compare(
      password,
      user.password!
    );

    if (!validPassword) {
      return NextResponse.json({
        message: "Invalid Password !",
        status: 400,
        success: false,
      });
    }

    // Create token
    const tokenData: ITokenData = {
      id: user._id!,
      username: user.username!,
      fullname: user.fullname!,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!);

    const response = NextResponse.json({
      message: "Logged in successfully !",
      status: 200,
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      expires: 2147483647,
    });

    return response;
  } catch (error) {
    return NextResponse.json({
      error: error,
      message: "Sorry, something went wrong !",
      status: 500,
      success: false,
    });
  }
}
