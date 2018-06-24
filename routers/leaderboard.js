const leadboardRouter = require('express').Router()
const leaderboardController = require('../controllers/leaderboard')

leadboardRouter
	.route('/:id')
	.get(leaderboardController.GET_LEADERBOARD)

module.exports = leadboardRouter