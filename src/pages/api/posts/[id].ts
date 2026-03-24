import { NextApiRequest, NextApiResponse } from 'next'
import { initializeDatabase } from '@/lib/database'
import { Post } from '@/entities/Post'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { AppDataSource } = await initializeDatabase()
  const postRepository = AppDataSource.getRepository(Post)
  const { id } = req.query
  
  switch (req.method) {
    case 'GET':
      try {
        const post = await postRepository.findOne({ where: { id: Number(id) } })
        
        if (!post) {
          return res.status(404).json({ error: 'Post not found' })
        }
        
        res.status(200).json({
          id: post.id,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        })
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' })
      }
      break
      
    case 'PUT':
      try {
        // Verify authentication
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' })
        }
        
        const post = await postRepository.findOne({ where: { id: Number(id) } })
        
        if (!post) {
          return res.status(404).json({ error: 'Post not found' })
        }
        
        const { title, content } = req.body
        
        if (title) post.title = title
        if (content) post.content = content
        
        await postRepository.save(post)
        
        res.status(200).json({
          id: post.id,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        })
      } catch (error) {
        res.status(500).json({ error: 'Failed to update post' })
      }
      break
      
    case 'DELETE':
      try {
        // Verify authentication
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' })
        }
        
        const post = await postRepository.findOne({ where: { id: Number(id) } })
        
        if (!post) {
          return res.status(404).json({ error: 'Post not found' })
        }
        
        await postRepository.remove(post)
        
        res.status(204).end()
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' })
      }
      break
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}