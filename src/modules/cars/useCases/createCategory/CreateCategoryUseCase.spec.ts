import { AppError } from "@shared/errors/AppError"
import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory"
import { CreateCategoryUseCase } from "./CreateCategoryUseCase"

describe('Create category', () => {

  let createCategoryUseCase: CreateCategoryUseCase
  let categoriesRepositoryInMemory: CategoriesRepositoryInMemory

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepositoryInMemory)
  })

  it('Should be able to create a new category', async () => {
    const category = {
      name: "Category Test",
      description: "Category description test"
    }
    await createCategoryUseCase.execute(category)

    const categoryCreated = await categoriesRepositoryInMemory.findByName(category.name)


    expect(categoryCreated).toHaveProperty("id")
  })

  it('Should not be able to create a new category if name already exists', async () => {
    
    const category = {
      name: "Category Test",
      description: "Category description test"
    }
    
    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description
    })

    await expect(
      createCategoryUseCase.execute({
        name: category.name,
        description: category.description
      })
    ).rejects.toEqual(new AppError('Category already exists!', 401))
    
  })
})