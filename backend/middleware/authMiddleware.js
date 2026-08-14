import jwt from 'jsonwebtoken'

// Reads "Authorization: Bearer <token>", verifies it, and attaches the
// decoded user id to req.userId. Any route using this middleware is
// private — Week 5 item 2 applies this to all /api/habits routes.
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' })
  }
}
