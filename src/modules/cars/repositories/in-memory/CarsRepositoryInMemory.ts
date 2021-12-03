import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    name, 
    daily_rate, 
    category_id, 
    brand, 
    description, 
    fine_amount, 
    license_plate
  }: ICreateCarDTO) {
    const car = new Car()

    Object.assign(car, {
      name, 
      daily_rate, 
      category_id, 
      brand, 
      description, 
      fine_amount, 
      license_plate
    })

    this.cars.push(car)
    return car
  }
  
  async findByLicensePlate(license_plate: string) {
    return this.cars.find((car) => car.license_plate === license_plate)
  }

  async findAvailable(
    brand?: string, 
    category_id?: string, 
    name?: string
  ) {
    const all = this.cars
    .filter((car) => car.available === true)
    .filter(
      (car) => {
        if(
          car.available === true ||
          (brand && car.brand === brand) ||
          (category_id && car.category_id === category_id) ||
          (name && car.name === name)
        ) {
          return car
        }
        return null
      })
    return all
  }

  async findById(id: string) {
    return this.cars.find((car) => car.id === id)
  }
}

export { CarsRepositoryInMemory }