const {UsersGames, Users, Games, db} = require('../../db');
const Sequelize = require('Sequelize');
const {Op} = Sequelize; 


const getLineGraph = async(yourId = 1, opponentId = 2)=>{
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
		console.log('---YOURS---',yourGames, gameIds); 
		console.log('---THEIRS---', theirGames);
	}catch(error){
		console.error('error in getting opponent line graph', error); 
	}
}

module.exports = getLineGraph; 