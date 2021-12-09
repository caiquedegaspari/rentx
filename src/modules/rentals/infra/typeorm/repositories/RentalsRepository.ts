import { ICreateRentalDTO } from "@modules/rentals/dtos/CreateRentalDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { getRepository, Repository } from "typeorm";
import { Rental } from "../entities/Rental";


class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>
  
  constructor() {
    this.repository = getRepository(Rental)
  }

  async create({ car_id, user_id, expect_return_date }: ICreateRentalDTO) {
    const rental = this.repository.create({
      car_id,
      expect_return_date,
      user_id
    })
    await this.repository.save(rental)

    return rental
  }

  async findOpenRentalByCar(car_id: string) {
    const openByCar = await this.repository.findOne({
      car_id
    })
    return openByCar
  }

  async findOpenRentalByUser(user_id: string) {
    const openByUser = await this.repository.findOne({
      user_id
    })
    return openByUser
  }
}

export { RentalsRepository }