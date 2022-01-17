import { instanceToInstance } from "class-transformer";
import { IUserResponseDTO } from "../dtos/IUsersResponseDTO";
import { User } from "../infra/typeorm/entities/User";

class UserMap {

  static toDTO({
    email,
    name,
    id,
    avatar,
    driver_license,
    avatar_url
  }: User): IUserResponseDTO {
    const user = instanceToInstance({
      avatar_url,
      email,
      name,
      id,
      avatar,
      driver_license
      
    })
    return user
  }

}

export { UserMap }