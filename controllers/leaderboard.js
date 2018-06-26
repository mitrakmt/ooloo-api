const leaderboardController = {}
const leaderboardModel = require('../models/leaderboard')

leaderboardController.GET_LEADERBOARD = async(req, res)=>{
	try{
		const userId = req.user.id
		const leaderboard = await leaderboardModel.GET_LEADERBOARD(userId)
		res.status(200).send(leaderboard)
	}catch(error){
		res.status(500).send(error)
	}
}

module.exports = leaderboardController