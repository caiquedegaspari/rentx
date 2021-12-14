import { ICreateRentalDTO } from "@modules/rentals/dtos/CreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "../IRentalsRepository";


class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = []

  async findOpenRentalByCar(car_id: string) {
    const rental = this.rentals.find((rental) => rental.car_id === car_id && !rental.end_date)
    return rental
  }

  async findOpenRentalByUser(user_id: string) {
    const rental = this.rentals.find((rental) => rental.user_id === user_id && !rental.end_date)
    return rental
  }

  async create({ car_id, expect_return_date, user_id }: ICreateRentalDTO ) {
    const rental = new Rental()

    Object.assign(rental, {
      car_id,
      user_id,
      expect_return_date,
      startDate: new Date()
    })

    this.rentals.push(rental)
    return rental
  }

  async findById(id: string) {
    return this.rentals.find((rental) => rental.id === id)
  }

  async findByUserId(user_id: string) {
    const rentals = this.rentals.filter((rental) => rental.user_id === user_id)
    return rentals
  }
}

export { RentalsRepositoryInMemory }