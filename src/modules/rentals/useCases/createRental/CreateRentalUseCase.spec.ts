import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentailsRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateRentalUseCase } from "./CreateRentalUseCase"

let createRentalUseCase: CreateRentalUseCase
let rentalsRepository: RentalsRepositoryInMemory

describe('Create Rental', () => {
  beforeEach(() => {
    rentalsRepository = new RentalsRepositoryInMemory()
    createRentalUseCase = new CreateRentalUseCase(rentalsRepository)
  })
  it('Should be able to create a rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '121212',
      expected_return_date: new Date()
    });

    console.log(rental)

    expect(rental).toHaveProperty('id')
  })

  it('Should not be able to create a new rental if there is another open rental to the same user', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '121212',
        expected_return_date: new Date()
      });

      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '121212',
        expected_return_date: new Date()
      });
    }).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to create a new rental if there is another open rental to the same car', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '123',
        car_id: 'test',
        expected_return_date: new Date()
      });

      await createRentalUseCase.execute({
        user_id: '321',
        car_id: 'test',
        expected_return_date: new Date()
      });
    }).rejects.toBeInstanceOf(AppError)
  })
})