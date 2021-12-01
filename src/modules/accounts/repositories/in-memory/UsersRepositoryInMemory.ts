import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = []

  async create({ driver_license, password, email, name }: ICreateUserDTO) {
    const user = new User()
    Object.assign(user, {
      driver_license, 
      password, 
      email, 
      name
    })
    this.users.push(user)
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email)
  }

  async findById(id: string) {
    return this.users.find((user) => user.id === id)
  }
}

export { UsersRepositoryInMemory }