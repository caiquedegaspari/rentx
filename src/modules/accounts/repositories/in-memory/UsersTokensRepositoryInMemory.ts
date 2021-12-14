import { ICreateUserTokensDTO } from "@modules/accounts/dtos/ICreateUserTokensDTO"
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens"
import { IUsersTokensRepository } from "../IUsersTokensRepository"

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  private usersTokens: UserTokens[] = []

  async create({ 
    user_id, 
    expires_date, 
    refresh_token 
  }: ICreateUserTokensDTO) {
    const userToken = new UserTokens()

    Object.assign(userToken, {
      user_id,
      expires_date,
      refresh_token
    })

    this.usersTokens.push(userToken)

    return userToken
  }

  async findByUserIdAndRefreshToken(user_id: string, refresh_token: string) {
    const userToken = this.usersTokens.find((userTokens) => 
      userTokens.user_id === user_id && 
      userTokens.refresh_token === refresh_token
    )
    return userToken
  }

  async deleteById(id: string) {
    const userToken = this.usersTokens.find((userToken) => userToken.id === id)
    this.usersTokens.splice(this.usersTokens.indexOf(userToken))
  }

  async findByRefreshToken(refresh_token: string) {
    const userToken = this.usersTokens.find((userToken) => userToken.refresh_token === refresh_token)
    return userToken
  }

}

export { UsersTokensRepositoryInMemory }