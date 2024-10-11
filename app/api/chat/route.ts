import { google } from "@ai-sdk/google";
import { streamText, convertToCoreMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const model = google("gemini-1.5-flash-latest");
  const result = await streamText({
    model: model,
    system: "Your name is AI HealthCare Assistant and you are here to help. Only respond to messages that are related to health. Don't respond to messages that are not related to health, Reply that you don't know anything other than health if asked anything other than health related info.",
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
