import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { format } from 'date-fns'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import { initializeDatabase } from '@/lib/database'
import { Post } from '@/entities/Post'

type PostPageProps = {
  post: {
    id: number
    title: string
    content: string
    createdAt: string
    updatedAt: string
  } | null
}

export default function PostPage({ post }: PostPageProps) {
  const router = useRouter()
  
  if (router.isFallback) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="mb-4">The post you're looking for doesn't exist.</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>
    )
  }
  
  const cleanHtml = DOMPurify.sanitize(marked.parse(post.content) as string)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <div className="text-gray-500 text-sm">
            <time dateTime={post.createdAt}>
              Published: {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
            </time>
            {post.updatedAt !== post.createdAt && (
              <span className="ml-4">
                Updated: {format(new Date(post.updatedAt), 'MMMM dd, yyyy')}
              </span>
            )}
          </div>
        </header>
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </article>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!
  
  try {
    const { AppDataSource } = await initializeDatabase()
    const postRepository = AppDataSource.getRepository(Post)
    const post = await postRepository.findOne({ where: { id: Number(id) } })
    
    if (!post) {
      return {
        props: {
          post: null
        }
      }
    }
    
    return {
      props: {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        }
      }
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return {
      props: {
        post: null
      }
    }
  }
}