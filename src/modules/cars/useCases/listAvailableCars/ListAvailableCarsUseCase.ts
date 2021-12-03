import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { inject, injectable } from "tsyringe";


interface IRequest {
  category_id?: string;
  brand?: string;
  name?: string
}

@injectable()
class ListAvailableCarsUseCase {

  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({ name, brand, category_id }: IRequest) {
    const cars = this.carsRepository.findAvailable(brand, category_id, name)
    return cars
  }
}

export { ListAvailableCarsUseCase }