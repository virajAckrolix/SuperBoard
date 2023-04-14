const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/RefreshController");

router.get("/refreshToken", refreshTokenController.Refresh);

module.exports = router;
