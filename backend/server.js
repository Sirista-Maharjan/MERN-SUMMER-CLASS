import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import habitRoutes from './routes/habitRoutes.js'
import authRoutes from './routes/authRoutes.js'
import aiRoutes from './routes/aiRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

// Week 6 item 2: CORS_ORIGIN is set in the Render dashboard to the
// deployed Netlify URL. Falls back to allowing all origins in local
// dev if it isn't set.
const corsOrigin = process.env.CORS_ORIGIN
app.use(cors(corsOrigin ? { origin: corsOrigin } : {}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/habits', habitRoutes)
app.use('/api/ai', aiRoutes)

app.get('/', (req, res) => {
  res.send('Habit Tracker API is running')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
