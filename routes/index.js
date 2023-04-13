const express = require('express')
const userRoutes = require('./User')

const router = express.Router()

router.use('/user' , userRoutes)

module.exports = router
