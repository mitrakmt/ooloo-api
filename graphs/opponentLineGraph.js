const {UsersGames, Users, Games, db} = require('../db');
const Sequelize = require('sequelize');
const {Op} = Sequelize; 


const geMatchHistoryGraph = async(yourId = 1, opponentId = 2, didYouWin)=>{
	try{
		const yourGamesQuery = await Users.findOne({
			include:[
				{
					model: Games,
					include:[
						{
							attributes:[],
							model:Users,
							where:{id: opponentId}
						}
					]
				}
			],
			where:{id:yourId},
		})
		const yourGames = yourGamesQuery.dataValues.games.map(({dataValues})=> dataValues.UsersGames.dataValues);
		const gameIds = yourGames.map(({gameId})=> gameId); 
		const theirGamesQuery = await UsersGames.findAll({
			where:{
				gameId: {[Op.or]: gameIds},
				userId: opponentId
			},
			order:[['gameId']]
		})
		const theirGames = theirGamesQuery.map(({dataValues})=> dataValues);
		return {
			data: mergeData(yourGames, theirGames, didYouWin)
		} 
	}catch(error){
		console.error('error in getting opponent line graph', error); 
	}
}

const mergeData = (yourGames, theirGames, didYouWin)=>{
	const gameObj = yourGames.reduce((totalObj, game)=>{
		totalObj[game.gameId] = game; 
		return totalObj; 
	},{})
	let gamesWon = 0; 
	const winHistory = theirGames.map((theirGame, index)=>{
		const yourGame = gameObj[theirGame.gameId];
		if(yourGame.score > theirGame.score) gamesWon++; 
		return gamesWon / (index+1)
	})
	if(didYouWin) gamesWon++;
	winHistory.push(gamesWon / (winHistory.length + 1));
	return winHistory; 
}

module.exports = {geMatchHistoryGraph}; 