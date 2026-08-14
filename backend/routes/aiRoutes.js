import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { getCoachingTips } from '../controllers/aiController.js'

const router = Router()

router.post('/coach', requireAuth, getCoachingTips)

export default router
