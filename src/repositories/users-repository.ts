export interface User {
  id?: string
  email: string
  password_hash: string
  created_at: Date
  session_token?: string
  refresh_token?: string
}

export type userDTO = Omit<User, 'created_at'>

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: userDTO): Promise<User>
}
