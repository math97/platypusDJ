import { randomUUID } from 'node:crypto'
import { User, UsersRepository, userDTO } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    if (!user) return null

    return user
  }

  async create(userDTO: userDTO) {
    const id = userDTO.id ? userDTO.id : randomUUID()

    const user = { id, ...userDTO, created_at: new Date() }
    this.users.push(user)

    return user
  }
}
