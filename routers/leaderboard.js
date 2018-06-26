const leadboardRouter = require('express').Router()
const leaderboardController = require('../controllers/leaderboard')
const checkJwt = require('../middleware/auth')

leadboardRouter
	.route('/')
	.get(checkJwt, leaderboardController.GET_LEADERBOARD)

module.exports = leadboardRouter