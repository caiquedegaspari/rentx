import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository"
import { AppError } from "@shared/errors/AppError"
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { inject, injectable } from "tsyringe"
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository"


interface IRequest {
  user_id: string
  car_id: string
  expect_return_date: Date
}

@injectable()
class CreateRentalUseCase {

  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    car_id,
    expect_return_date,
    user_id
  }: IRequest) {

    const minimumHour = 24

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(car_id)

    if(carUnavailable) {
      throw new AppError('Car unavailable')
    }

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id)

    if (rentalOpenToUser) {
      throw new AppError("There's a rental in progress for user!")
    }

    const dateNow = this.dateProvider.dateNow()

    const compare = this.dateProvider.compareInHours(dateNow, expect_return_date)


    if (compare < minimumHour) {
      throw new AppError('Invalid return time')
    }

    const rental = await this.rentalsRepository.create({
      car_id,
      expect_return_date,
      user_id
    })
    await this.carsRepository.updateAvailable(car_id, false)
    return rental
  }
}

export { CreateRentalUseCase }