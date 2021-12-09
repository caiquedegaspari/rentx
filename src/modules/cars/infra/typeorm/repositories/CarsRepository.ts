import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { getRepository, Repository } from "typeorm";
import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {

  private repository: Repository<Car>

  constructor() {
    this.repository = getRepository(Car)
  }

  async create({
    name,
    description,
    brand,
    daily_rate,
    fine_amount,
    license_plate,
    category_id,
    specifications,
    id
  }: ICreateCarDTO) {
    const car = this.repository.create({
      name,
      description,
      brand,
      daily_rate,
      fine_amount,
      license_plate,
      category_id,
      specifications,
      id
    })

    await this.repository.save(car)
    
    return car
  }

  async findByLicensePlate(license_plate: string) {
    const car = await this.repository.findOne({license_plate})
    return car
  }

  async findAvailable( brand?: string, category_id?: string, name?: string ) {
    const carsQuery = await this.repository
    .createQueryBuilder('cars')
    .where('available = :available', { available: true })

    if (brand) {
      carsQuery.andWhere('cars.brand = :brand', { brand })
    }
    if (name) {
      carsQuery.andWhere('cars.name = :name', { name })
    }
    if (category_id) {
      carsQuery.andWhere('cars.category_id = :category_id', { category_id })
    }
    
    const cars = await carsQuery.getMany()
    return cars

  }

  async findById(id: string) {
    const car = this.repository.findOne(id)
    return car
  }

  async updateAvailable(id: string, available: boolean) {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where('id = :id')
      .setParameters({id})
      .execute()
  }

}

export { CarsRepository }