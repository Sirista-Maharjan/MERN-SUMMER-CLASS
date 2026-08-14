import { GoogleGenAI } from '@google/genai'

let client = null

const maskKey = (key) => {
  if (!key) return '(empty)'
  if (key.length <= 8) return '*'.repeat(key.length)
  return `${key.slice(0, 4)}...${key.slice(-4)} (length ${key.length})`
}

// Lazily creates the client so a missing API key only breaks the
// /api/ai/coach route, not the whole server on boot.
export const getGeminiClient = () => {
  if (!client) {
    const rawKey = process.env.GEMINI_API_KEY
    const apiKey = (rawKey || '').trim().replace(/^["']|["']$/g, '')

    console.log('Gemini API key loaded:', maskKey(apiKey))

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not set (or empty) in backend/.env — get one at https://aistudio.google.com/apikey'
      )
    }

    // IMPORTANT: the @google/genai SDK auto-switches to Vertex AI
    // (OAuth/Application Default Credentials) instead of API-key auth
    // if certain ambient env vars are present — e.g. GOOGLE_GENAI_USE_VERTEXAI=true,
    // or a GOOGLE_API_KEY var (which silently takes priority over
    // GEMINI_API_KEY if both are set). When that happens, every request
    // fails with "Expected OAuth 2 access token" regardless of how
    // correct your GEMINI_API_KEY is — which is exactly the symptom
    // this project hit. Explicitly passing vertexai: false overrides
    // any such env var and guarantees plain API-key auth is used.
    if (process.env.GOOGLE_GENAI_USE_VERTEXAI) {
      console.warn(
        'GOOGLE_GENAI_USE_VERTEXAI is set in this environment — forcing vertexai: false so the Gemini API key is actually used.'
      )
    }
    if (process.env.GOOGLE_API_KEY) {
      console.warn(
        'GOOGLE_API_KEY is also set — this can silently override GEMINI_API_KEY. Forcing the explicit apiKey below to be used instead.'
      )
    }

    client = new GoogleGenAI({ apiKey, vertexai: false })
  }
  return client
}