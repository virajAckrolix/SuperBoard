const express = require('express')
const userRoutes = require('./User')
const refreshRoute = require('./Refresh')

const router = express.Router()

router.use('/user' , userRoutes)
router.use('/refresh' , refreshRoute)

module.exports = router
