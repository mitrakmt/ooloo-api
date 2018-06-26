const {Questions, Answers} = require('../../db');
const {Op} = require('Sequelize'); 

const getBarChart = async(userId, interests)=>{
	interestsIds = interests.map(({id})=> id); 
	const answers = await Answers.find({
		include:[{
			model: Questions,
			require: true, 
			where:{[Op.overlap]:{topics: interestsIds}}
		}]
	});
	console.log(answer); 
}