import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateCarUseCase } from "./CreateCarUseCase"

let carsRepository: CarsRepositoryInMemory
let createCarUseCase: CreateCarUseCase


describe('Create Car', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory()
    createCarUseCase = new CreateCarUseCase(carsRepository)
  })
  it('Should be able to create a car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category'
    })

    expect(car).toHaveProperty('id')
  })

  it('Should not be able to create a car with existent license plate', async () => {
    await createCarUseCase.execute({
        name: 'Car 1',
        description: 'Description Car 1',
        daily_rate: 100,
        license_plate: 'Car1-plate',
        fine_amount: 60,
        brand: 'Brand',
        category_id: 'category'
      })
    
    await expect(
      createCarUseCase.execute({
        name: 'Car 2',
        description: 'Description Car 2',
        daily_rate: 100,
        license_plate: 'Car1-plate',
        fine_amount: 60,
        brand: 'Brand',
        category_id: 'category'
      })
    ).rejects.toEqual(new AppError('Car already exists!'))
  })

  it('Should be able to create a car with availability true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car Available',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category'
    })
    expect(car.available).toBe(true)
  })
})