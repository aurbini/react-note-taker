const router = require('express').Router()
const userController = require('../../controllers/userController')
const authController = require('../../controllers/authController')
const auth = require('../../middleware/auth')

router.route('/register')
  .post(userController.register)

router.route('/')
  .get(userController.findAll)
  
//login
router.route('/auth')
  .post(authController.authorize)

router.route('/:id')
//   .put(userController.update)
  .delete(auth, userController.remove)
  .get(auth, userController.findByOne)
module.exports = router