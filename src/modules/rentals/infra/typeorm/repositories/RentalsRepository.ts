import { ICreateRentalDTO } from "@modules/rentals/dtos/CreateRentalDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { getRepository, Repository } from "typeorm";
import { Rental } from "../entities/Rental";


class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>
  
  constructor() {
    this.repository = getRepository(Rental)
  }

  async create({ car_id, user_id, expect_return_date, id, end_date, total }: ICreateRentalDTO) {
    const rental = this.repository.create({
      car_id,
      expect_return_date,
      user_id,
      id, 
      end_date,
      total
    })
    await this.repository.save(rental)

    return rental
  }

  async findOpenRentalByCar(car_id: string) {
    const openByCar = await this.repository.findOne({
      where: {
        car_id, end_date: null
      }
    })
    return openByCar
  }

  async findOpenRentalByUser(user_id: string) {
    const openByUser = await this.repository.findOne({
      where: {
        user_id, end_date: null
      }
    })
    return openByUser
  }
  async findById(id: string) {
    const rental = await this.repository.findOne(id)
    return rental
  }

  async findByUserId(user_id: string) {
    const rentals = await this.repository.find({
      where: { user_id },
      relations: ['car']
    })
    return rentals
  }
}

export { RentalsRepository }