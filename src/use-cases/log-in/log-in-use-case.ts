import { compare } from 'bcryptjs'
import { User, UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface LogInUseCaseRequest {
  email: string
  password: string
}

interface LogInUseCaseResponse {
  user: User
}

export class LogInUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: LogInUseCaseRequest): Promise<LogInUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doestPasswordMatches = await compare(password, user.password_hash)

    if (!doestPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
