import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { LogInUseCase } from './log-in-use-case'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: LogInUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new LogInUseCase(usersRepository)
  })

  it('should be able to log in', async () => {
    await usersRepository.create({
      email: 'platypusdjtest@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'platypusdjtest@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to log in with an email that does not exist', async () => {
    await expect(() =>
      sut.execute({
        email: 'platypusdjtest@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to log in with wrong email', async () => {
    await usersRepository.create({
      email: 'platypusdjtest@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'platypusdjtest@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
