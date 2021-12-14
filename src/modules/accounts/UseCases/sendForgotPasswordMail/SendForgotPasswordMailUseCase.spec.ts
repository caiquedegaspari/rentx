import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory"
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider"
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory"
import { AppError } from "@shared/errors/AppError"
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase"

let usersRepositoryInMemory: UsersRepositoryInMemory
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let dateProvider: DayjsDateProvider
let mailProviderInMemory: MailProviderInMemory
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase

describe('Send Forgot Password Mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    dateProvider = new DayjsDateProvider()
    mailProviderInMemory = new MailProviderInMemory()
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProviderInMemory
    )
  })

  it('Should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProviderInMemory, 'sendMail')

    await usersRepositoryInMemory.create({
      driver_license: '123als',
      email: 'test@email.com',
      name: 'test user',
      password: '123456',
    })
    await sendForgotPasswordMailUseCase.execute('test@email.com')

    expect(sendMail).toHaveBeenCalled()
  })

  it('Should not be able to send a forgot password mail to a non-existing user', async () => {

    await expect(
      sendForgotPasswordMailUseCase.execute('test@email.com')
    ).rejects.toEqual(new AppError('User does not exists!'))
  })

  it('Should be able to create an users token', async () => {
    const generateTokenEmail = jest.spyOn(usersRepositoryInMemory, 'create')
    
    await usersRepositoryInMemory.create({
      driver_license: '123als',
      email: 'test@email.com',
      name: 'test user',
      password: '123456',
    })

    await sendForgotPasswordMailUseCase.execute('test@email.com')

    expect(generateTokenEmail).toHaveBeenCalled()

  })
})