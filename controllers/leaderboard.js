const leaderboardController = {}
const leaderboardModel = require('../models/leaderboard')

leaderboardController.GET_LEADERBOARD = async(req, res)=>{
	console.log('getting leaderboard')
	try{
		const leaderboard = await leaderboardModel.GET_LEADERBOARD(req.params.id)
		res.status(200).send(leaderboard)
	}catch(error){
		res.status(500).send(error)
	}
}

module.exports = leaderboardController