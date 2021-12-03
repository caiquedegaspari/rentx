import { Router } from 'express'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { CreateSpecificationController } from '@modules/cars/useCases/createSpecifications/CreateSpecificationController'
import { ensureAdmin } from '../middlewares/ensureAdmin'

const specificationsRoutes = Router()

const createSpecificationController = new CreateSpecificationController()

specificationsRoutes.post('/', 
  ensureAuthenticated, 
  ensureAdmin, 
  createSpecificationController.handle
)

export { specificationsRoutes }