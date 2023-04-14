const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/Users/UserController')
const verifyJWT = require('../middlewares/verifyJWT')

router.post('/signup' , userControllers.SignUp)
router.post('/login' , userControllers.Login)

//protected routes
router.get('/logout' , verifyJWT  ,userControllers.Logout)
router.get('/getAllUsers' , verifyJWT , userControllers.getAllUsers)



module.exports = router