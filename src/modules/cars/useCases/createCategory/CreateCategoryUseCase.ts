import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository"
import { inject, injectable } from 'tsyringe'
import { AppError } from "@shared/errors/AppError"
interface IRequest {
  name: string
  description: string
}

@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}
  async execute({ name, description }: IRequest) {
    const categoryAlreadyExists = await this.categoriesRepository.findByName(name)
    if (categoryAlreadyExists) {
      throw new AppError('Category already exists!', 401)
    }

    this.categoriesRepository.create({name, description})
  }
}

export { CreateCategoryUseCase }