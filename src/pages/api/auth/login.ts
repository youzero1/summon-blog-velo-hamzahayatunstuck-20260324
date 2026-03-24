import { NextApiRequest, NextApiResponse } from 'next'
import * as jwt from 'jsonwebtoken'
import { initializeDatabase } from '@/lib/database'
import { User } from '@/entities/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  
  try {
    const { username, password } = req.body
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }
    
    const { AppDataSource } = await initializeDatabase()
    const userRepository = AppDataSource.getRepository(User)
    
    // For demo purposes, check against environment variables
    // In production, you would query the database
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    if (username === adminUsername && password === adminPassword) {
      // Check if user exists in database, create if not
      let user = await userRepository.findOne({ where: { username } })
      
      if (!user) {
        user = new User()
        user.username = username
        user.password = password
        await user.hashPassword()
        await userRepository.save(user)
      } else {
        // Verify password
        const isValid = await user.comparePassword(password)
        if (!isValid) {
          return res.status(401).json({ error: 'Invalid credentials' })
        }
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      )
      
      return res.status(200).json({ 
        token,
        user: {
          id: user.id,
          username: user.username
        }
      })
    }
    
    // Also check database for other users
    const user = await userRepository.findOne({ where: { username } })
    if (user) {
      const isValid = await user.comparePassword(password)
      if (isValid) {
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          process.env.JWT_SECRET!,
          { expiresIn: '24h' }
        )
        
        return res.status(200).json({ 
          token,
          user: {
            id: user.id,
            username: user.username
          }
        })
      }
    }
    
    res.status(401).json({ error: 'Invalid credentials' })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}