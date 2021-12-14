import { ICreateUserTokensDTO } from "@modules/accounts/dtos/ICreateUserTokensDTO"
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository"
import { getRepository, Repository } from "typeorm"
import { UserTokens } from "../entities/UserTokens"

class UsersTokensRepository implements IUsersTokensRepository {
  
  private repository: Repository<UserTokens>

  constructor() {
    this.repository = getRepository(UserTokens)
  }


  async create({ 
    user_id, 
    expires_date, 
    refresh_token 
  }: ICreateUserTokensDTO) {
    const userToken = this.repository.create({
      expires_date,
      refresh_token,
      user_id
    })
    await this.repository.save(userToken)

    return userToken
  }

  async findByUserIdAndRefreshToken(user_id: string, refresh_token: string) {
    const usersTokens = await this.repository.findOne({
      user_id,
      refresh_token
    })
    return usersTokens
  }

  async deleteById(id: string) {
      await this.repository.delete(id)
  }

  async findByRefreshToken(refresh_token: string) {
    const userToken = await this.repository.findOne({
      refresh_token
    })
    return userToken
  }

}

export { UsersTokensRepository }