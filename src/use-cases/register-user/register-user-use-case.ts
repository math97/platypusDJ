import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { hash } from 'bcryptjs'
import { User, UsersRepository } from '@/repositories/users-repository'

interface RegisterUserUseCaseRequest {
  email: string
  password: string
}

interface RegisterUserUseCaseResponse {
  user: User
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      email,
      password_hash,
    })

    return { user }
  }
}
