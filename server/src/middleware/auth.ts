import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'flowdesk-dev-secret-change-in-production'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
  userName?: string
}

export function generateToken(payload: { id: string; role: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }

  try {
    const token = header.slice(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; name: string }
    req.userId = decoded.id
    req.userRole = decoded.role
    req.userName = decoded.name
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireManager(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.userRole !== 'manager') {
    res.status(403).json({ error: 'Manager access required' })
    return
  }
  next()
}

export function requireAccountant(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.userRole !== 'accountant') {
    res.status(403).json({ error: 'Accountant access required' })
    return
  }
  next()
}
