const {Router} = require('express')
const authController = require('../controllers/auth')
const router = Router()

router.post('/signup', authController.signup)

router.post('/login', authController.login)

router.post('./logout', authController.logout)

module.exports = router