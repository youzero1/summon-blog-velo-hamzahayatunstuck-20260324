import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import * as bcrypt from 'bcryptjs'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  username!: string

  @Column()
  password!: string

  @CreateDateColumn()
  createdAt!: Date

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password)
  }
}