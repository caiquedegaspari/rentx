import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@config/upload'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { CreateUserController } from '@modules/accounts/UseCases/createUser/CreateUserController'
import { UpdateUserAvatarController } from '@modules/accounts/UseCases/updateUserAvatar/updateUserAvatarController'

const usersRoutes = Router()
const createUserController = new CreateUserController()
const updateUserAvatarController = new UpdateUserAvatarController()

const uploadAvatar = multer(uploadConfig.upload('./tmp/avatar'))

usersRoutes.post('/', createUserController.handle)

usersRoutes.patch(
  '/avatar', 
  ensureAuthenticated,
  uploadAvatar.single('avatar'), 
  updateUserAvatarController.handle
  )

export { usersRoutes }