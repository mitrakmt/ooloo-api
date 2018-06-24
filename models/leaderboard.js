const schoolModel = require('./school'); 
const userModel = require('./user');

const leaderboardModel = {}; 

const mockUniversities = [
	{rank: 1, id: 4, name:'UCD', points: 100000},
	{rank: 2, id: 42, name:'John Hopkins', points: 90000},
	{rank: 3, id: 51, name:'NYU', points: 80000},
	{rank: 4, id: 99, name:'Stanford', points: 70000},
	{rank: 5, id: 214, name:'Perelmen', points: 60000},
	{rank: 6, id: 55, name: 'UCLA', points: 50000},
	{rank: 7, id: 94, name: 'Duke', points: 40000},
	{rank: 8, id: 13, name: 'University of Washington', points: 35000},
	{rank: 9, id: 112, name: 'University of Pittsburg', points: 30000},
	{rank: 10, id: 147, name: 'Vanderbilt University', points: 20000}, 
	{rank: 112, id: 1, name: 'Schoolington', isYourSchool: true}
]

leaderboardModel.GET_LEADERBOARD = async (id)=>{
	console.log('getting id:', id); 
	try{
		const userLeaderboard = await userModel.GET_USER_LEADERBOARD(id);
		console.log('userLeaderboard', userLeaderboard)
		const {university} = userLeaderboard.find(({isYou}) => isYou); 
		//const schoolLeaderboard = await schoolModel.GET_SCHOOL_LEADERBOARD(university); 
		schoolLeaderboard = mockUniversities; 
		return {users: userLeaderboard, schools: schoolLeaderboard}; 
	}catch(error){
		console.error('leaderboard model get leaderboard error: ', error)
	}
}

module.exports = leaderboardModel; 