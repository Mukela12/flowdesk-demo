import { Router } from 'express'
import bcrypt from 'bcryptjs'
import pool from '../db/pool.js'
import { generateToken, authMiddleware, type AuthRequest } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = generateToken({ id: user.id, role: user.role, name: user.name })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [
      req.userId,
    ])
    if (!result.rows[0]) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Get user error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
