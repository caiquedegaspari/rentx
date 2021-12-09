import dayjs from 'dayjs'
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentailsRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateRentalUseCase } from "./CreateRentalUseCase"
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory'


let dayjsProvider: DayjsDateProvider
let createRentalUseCase: CreateRentalUseCase
let rentalsRepository: RentalsRepositoryInMemory
let carsRepositoryInMemory: CarsRepositoryInMemory

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate()
  beforeEach(() => {
    rentalsRepository = new RentalsRepositoryInMemory()
    dayjsProvider = new DayjsDateProvider()
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository, 
      dayjsProvider,
      carsRepositoryInMemory
    )
  })
  it('Should be able to create a rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '121212',
      expect_return_date: dayAdd24Hours
    });

    expect(rental).toHaveProperty('id')
  })

  it('Should not be able to create a new rental if there is another open rental to the same user', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '121212',
        expect_return_date: dayAdd24Hours
      });

      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '121212',
        expect_return_date: dayAdd24Hours
      });
    }).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to create a new rental if there is another open rental to the same car', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '123',
        car_id: 'test',
        expect_return_date: dayAdd24Hours
      });

      await createRentalUseCase.execute({
        user_id: '321',
        car_id: 'test',
        expect_return_date: dayAdd24Hours
      });
    }).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to create a new rental with invalid return time', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '123',
        car_id: 'test',
        expect_return_date: dayjs().toDate()
      });

    }).rejects.toBeInstanceOf(AppError)
  })
})