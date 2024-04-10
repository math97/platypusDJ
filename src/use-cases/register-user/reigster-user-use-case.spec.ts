import { beforeEach, describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { RegisterUserUseCase } from './register-user-use-case'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUserUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(usersRepository)
  })

  it('should hash user password upon registration', async () => {
    const password = '123456'

    const { user } = await sut.execute({
      email: 'platypusdjtest@example.com',
      password,
    })

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
  it('should not be able to register with same email twice', async () => {
    const email = 'platypusdjtest@example.com'

    await sut.execute({
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
  it('should be able to register', async () => {
    const email = 'platypusdjtest@example.com'

    const { user } = await sut.execute({
      email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
