import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@config/upload'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { CreateUserController } from '@modules/accounts/UseCases/createUser/CreateUserController'
import { UpdateUserAvatarController } from '@modules/accounts/UseCases/updateUserAvatar/updateUserAvatarController'
import { ProfileUserController } from '@modules/accounts/UseCases/profileUserUseCase/ProfileUserController'

const usersRoutes = Router()
const createUserController = new CreateUserController() 
const updateUserAvatarController = new UpdateUserAvatarController()
const profileUserController = new ProfileUserController()

const uploadAvatar = multer(uploadConfig)

usersRoutes.post('/', createUserController.handle)
 
usersRoutes.patch(
  '/avatar', 
  ensureAuthenticated,
  uploadAvatar.single('avatar'), 
  updateUserAvatarController.handle
  )

usersRoutes.get('/profile', ensureAuthenticated, profileUserController.handle)

export { usersRoutes }