import { DataSource } from 'typeorm'
import { Post } from '../entities/Post'
import { User } from '../entities/User'

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_URL || './database.sqlite',
  synchronize: true,
  logging: false,
  entities: [Post, User],
  migrations: [],
  subscribers: [],
})

let isInitialized = false

async function initializeDatabase() {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize()
      console.log('Database connection established')
      isInitialized = true
      
      // Create default admin user if not exists
      const userRepository = AppDataSource.getRepository(User)
      const adminUser = await userRepository.findOne({ where: { username: 'admin' } })
      
      if (!adminUser) {
        const newAdmin = new User()
        newAdmin.username = 'admin'
        newAdmin.password = 'admin123' // This should be hashed in production
        await userRepository.save(newAdmin)
        console.log('Default admin user created')
      }
    } catch (error) {
      console.error('Error during database initialization:', error)
      throw error
    }
  }
  return AppDataSource
}

export { AppDataSource, initializeDatabase }