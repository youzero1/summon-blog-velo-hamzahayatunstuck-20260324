import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { initializeDatabase } from '@/lib/database'
import { Post } from '@/entities/Post'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { AppDataSource } = await initializeDatabase()
  const postRepository = AppDataSource.getRepository(Post)
  
  switch (req.method) {
    case 'GET':
      try {
        const posts = await postRepository.find({
          order: { createdAt: 'DESC' }
        })
        res.status(200).json(posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        })))
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' })
      }
      break
      
    case 'POST':
      try {
        // Verify authentication
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' })
        }
        
        const { title, content } = req.body
        
        if (!title || !content) {
          return res.status(400).json({ error: 'Title and content are required' })
        }
        
        const post = new Post()
        post.title = title
        post.content = content
        
        await postRepository.save(post)
        
        res.status(201).json({
          id: post.id,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        })
      } catch (error) {
        res.status(500).json({ error: 'Failed to create post' })
      }
      break
      
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}