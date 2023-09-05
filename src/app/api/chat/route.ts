import { NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(request: Request) {
  const { prompt, userMessage } = await request.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "ft:gpt-3.5-turbo-0613:personal:paul:7vG72ZUh",
      messages: [
          {"role": "system", "content": prompt},
          {"role": "user", "content": userMessage},
      ],
      temperature: 0.5,
    });
    
    return NextResponse.json(chatCompletion.choices[0].message);
  } catch (error) {
    console.error("Detailed Error:", error);
    return NextResponse.json({ error: "Error calling the OpenAI API" });
  }
}
