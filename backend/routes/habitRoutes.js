import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import {
  getHabits,
  createHabit,
  completeHabit,
  deleteHabit,
  getHabitHistory,
} from '../controllers/habitController.js'

const router = Router()

router.use(requireAuth)

router.get('/', getHabits)
router.post('/', createHabit)
router.post('/:id/complete', completeHabit)
router.delete('/:id', deleteHabit)
router.get('/:id/history', getHabitHistory)

export default router
