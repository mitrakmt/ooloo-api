const {UsersGames, Users, Games, db} = require('../../db');
const Sequelize = require('Sequelize');
const {Op} = Sequelize; 


const getLineGraph = async(yourId = 1, opponentId = 2)=>{
	try{
		const result = await Users.findOne({
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
			where:{id:yourId}
		})
		console.log(result.dataValues.games.map(({dataValues})=>dataValues.UsersGames.dataValues)); 
	}catch(error){
		console.error('error in getting opponent line graph', error); 
	}
}

module.exports = getLineGraph; 