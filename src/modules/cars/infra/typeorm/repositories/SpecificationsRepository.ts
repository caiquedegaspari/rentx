import { ICreateSpecificationDTO, ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { getRepository, Repository } from "typeorm";
import { Specification } from "../entities/Specification";


class SpecificationsRepository implements ISpecificationsRepository {

  private repository: Repository<Specification>

  constructor() {
    this.repository = getRepository(Specification)
  }

  async create({description, name}: ICreateSpecificationDTO) {
    const specification = this.repository.create({
      description,
      name
    })
    await this.repository.save(specification)
    return specification
  }
  async findByName(name: string) {
    const specification = await this.repository.findOne({name})
    return specification
  }

  async findByIds(ids: string[]) {
    const specifications = await this.repository.findByIds(ids)
    return specifications
  }

}

export { SpecificationsRepository }