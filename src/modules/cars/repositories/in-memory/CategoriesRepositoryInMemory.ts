import { Category } from "../../infra/typeorm/entities/Category";
import { ICategoriesRepository, ICreateCategoryDTO } from "../ICategoriesRepository";

class CategoriesRepositoryInMemory implements ICategoriesRepository {

  categories: Category[] = []

  async findByName(name: string) {
    const category = this.categories.find((category) => category.name === name)
    return category
  } 
  async list() {
    const list = this.categories
    return list
 }
  async create({name, description}: ICreateCategoryDTO) {
    const category = new Category()

    Object.assign(category, {
      name,
      description
    })

    this.categories.push(category)
 }
}

export { CategoriesRepositoryInMemory }