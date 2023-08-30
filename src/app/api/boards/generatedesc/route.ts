import { NextRequest, NextResponse } from "next/server";
import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.PALMAI_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY!),
});

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { boardTitle, listTitle, cardTitle } = reqBody;

    const prompt = `It is a kanban board titled as ${boardTitle}, it has a list called ${listTitle}, a card named ${cardTitle} has been created under the mentioned list. Now, generate a proper and detailed description for this card.`;

    const description = await client.generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    });

    return NextResponse.json({
      message: "Description generated successfully",
      status: 200,
      success: true,
      resultObject: description[0].candidates![0].output!,
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
