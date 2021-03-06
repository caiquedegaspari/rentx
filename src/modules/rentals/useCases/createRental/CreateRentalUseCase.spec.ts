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
    carsRepositoryInMemory= new CarsRepositoryInMemory()
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository, 
      dayjsProvider,
      carsRepositoryInMemory
    )
  })
  it('Should be able to create a rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      brand: 'Brand',
      category_id: '1234'
    })
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expect_return_date: dayAdd24Hours
    });

    expect(rental).toHaveProperty('id')
  })

  it('Should not be able to create a new rental if there is another open rental to the same user', async () => {
    await rentalsRepository.create({
      car_id: '1111',
      user_id: '12345',
      expect_return_date: dayAdd24Hours
    })

    await expect(
      createRentalUseCase.execute({
        user_id: '12345',
        car_id: '121212',
        expect_return_date: dayAdd24Hours
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"))
  })

  it('Should not be able to create a new rental if there is another open rental to the same car', async () => {
    

    await rentalsRepository.create({
      car_id: 'test',
      user_id: '12345',
      expect_return_date: dayAdd24Hours
    })
    await expect(
      createRentalUseCase.execute({
        user_id: '321',
        car_id: 'test',
        expect_return_date: dayAdd24Hours
      })
    ).rejects.toEqual(new AppError('Car unavailable'))
  })

  it('Should not be able to create a new rental with invalid return time', async () => {
    await expect(
       createRentalUseCase.execute({
        user_id: '123',
        car_id: 'test',
        expect_return_date: dayjs().toDate()
      })
    ).rejects.toEqual(new AppError('Invalid return time'))
  })
})