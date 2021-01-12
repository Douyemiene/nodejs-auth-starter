const {Router} = require('express')
const authController = require('../controllers/authController')
const router = Router()

router.post('/signup', authController.signup)

router.post('/login', authController.login)

router.get('/sign', () => {
    console.log('adsjddk')
})

router.post('./logout', authController.logout)

module.exports = router