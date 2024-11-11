import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const saltRounds = 10
const secretKey = process.env.JWT_SECRET || 'your-secret-key'

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

export const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '24h' })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey)
  } catch (error) {
    return null
  }
};

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  };

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid token.' })
  }

  req.user = decoded
  next()
};
