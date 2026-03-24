import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { initializeDatabase } from '@/lib/database'
import { Post } from '@/entities/Post'

type HomeProps = {
  posts: {
    id: number
    title: string
    content: string
    createdAt: string
  }[]
}

export default function Home({ posts }: HomeProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-center mb-4">Welcome to Our Blog</h1>
        <p className="text-xl text-center text-gray-600">Latest articles and thoughts</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">
                {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                </span>
                <Link 
                  href={`/posts/${post.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link 
          href="/admin"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Admin Panel
        </Link>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { AppDataSource } = await initializeDatabase()
    const postRepository = AppDataSource.getRepository(Post)
    const posts = await postRepository.find({
      order: { createdAt: 'DESC' },
    })
    
    return {
      props: {
        posts: posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt.toISOString(),
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      props: {
        posts: []
      }
    }
  }
}