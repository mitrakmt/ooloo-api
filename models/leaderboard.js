const schoolModel = require('./school'); 
const userModel = require('./user');

const leaderboardModel = {}; 

leaderboardModel.GET_LEADERBOARD = async (id)=>{
	try{
		const userLeaderboard = await userModel.GET_USER_LEADERBOARD(id);
		const {university} = userLeaderboard.find(({isYou}) => isYou); 
		const schoolLeaderboard = await schoolModel.GET_SCHOOL_LEADERBOARD(university); 
		return {users: userLeaderboard, schools: schoolLeaderboard}; 
	}catch(error){
		console.error('leaderboard model get leaderboard error: ', error)
	}
}

module.exports = leaderboardModel; 