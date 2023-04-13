const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/Users/UserController')

router.post('/signup' , userControllers.SignUp)
router.post('/login' , userControllers.Login)



module.exports = router