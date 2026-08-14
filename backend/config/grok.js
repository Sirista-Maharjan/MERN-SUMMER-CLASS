import dotenv from 'dotenv'
import Groq from 'groq-sdk'
dotenv.config({
  path: './.env',
})

let groq = null

function getGroqClient() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured')
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }
  return groq
}

const systemPrompt = `
You are a helpful habit summarizer for personal habit tracker.
Your role is to assist users with summarizing their daily habit progress.
Respond clearly and patiently. If user asks anything else than habit summary then suggest them to ask only the summary about habits. Summarize based on available habit data only.
Keep responses brief and do not ask further question to the user.
`

export async function getHabitSummary(userInput) {
  const client = getGroqClient()
  const completion = await client.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userInput,
      },
    ],
    model: 'openai/gpt-oss-20b',
  })
  return completion?.choices[0].message.content
}