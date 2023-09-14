import { NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(request: Request) {
  const { prompt, messageHistory } = await request.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const formattedMessages = messageHistory.map((msg: { sender: string; text: any; }) => ({
      role: msg.sender.toLowerCase(),
      content: msg.text
    }));

    formattedMessages.unshift({ role: 'system', content: prompt });

    const chatCompletion = await openai.chat.completions.create({
      model: "ft:gpt-3.5-turbo-0613:personal:paul:7yYLNQ3L",
      messages: formattedMessages
    });

    if (chatCompletion.choices && chatCompletion.choices.length > 0) {
      return NextResponse.json(chatCompletion.choices[0].message);
    } else {
      console.error("Unexpected API response:", chatCompletion);
      return NextResponse.json({ error: "Unexpected API response" });
    }

  } catch (error) {
    console.error("Error calling the OpenAI API", error);
    return NextResponse.json({ error: "Error calling the OpenAI API" });
  }
}


