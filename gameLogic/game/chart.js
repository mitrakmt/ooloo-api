const {Questions, Answers} = require('../../db');
const {Op} = require('Sequelize'); 

const getBarChart = async(userId, interests)=>{
	interestsIds = interests.map(({id})=> id); 
	const answers = await Answers.find({
		attributes:[
   			[Sequelize.where(Sequelize.fn("COUNT", Sequelize.col("questions.correct")), {'questions.correct': true, "correct"],
   			[Sequelize.where(Sequelize.fn("COUNT", Sequelize.col("questions.correct")), {'questions.correct': false, "incorrect"]
		]
		include:[{
			model: Questions,
			require: true,
			attributes:[]
			where:{[Op.overlap]:{topics: interestsIds}, userId}
		}],
		group: 'questions.topics'
	});
	console.log(answer); 
}