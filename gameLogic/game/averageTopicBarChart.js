const {Questions, Interests, Answers, db} = require('../../db');
const Sequelize = require('Sequelize');
const {Op} = Sequelize; 

const getBarChart = async(userId, interests)=>{
	try{
		interestsIds = interests.map(({id})=> id); 
		const correctPromise = Questions.findAll({
			include:[{
				model: Answers,
				attributes:[],
				as: 'userAnswers',
				where:{userId, 'correct': true}
			}],
			attributes: ['topics',[db.fn("COUNT", db.col("userAnswers.id")), 'correct']],
			where:{topics:{[Op.overlap]: interestsIds}},
			group: ['questions.id']
		});
		const incorrectPromise = Questions.findAll({
			include:[{
				model: Answers,
				attributes:[],
				as: 'userAnswers',
				where:{userId, 'correct': false}
			}],
			attributes: ['topics',[db.fn("COUNT", db.col("userAnswers.id")), 'incorrect']],
			where:{topics:{[Op.overlap]: interestsIds}},
			group: ['questions.id']
		});
		const [correct, incorrect] = await Promise.all([correctPromise, incorrectPromise]);
		console.log(incorrect.map(({dataValues})=> dataValues));
		return await sumCharts(correct, incorrect);  
	}catch(error){
		console.error(error);
	}
}
const sumCharts = async(correct, incorrect)=>{
	try{
		let totalObj = sumTopics(correct, 'correct');
		const incorrectObj = sumTopics(incorrect, 'incorrect', totalObj); 
		const topicIds = Object.keys(totalObj); 
		const topicsResult = await Interests.findAll({
			where:{id:{[Op.or]: topicIds}},
			attributes:['name', 'id']
		});
		const topicsArray = topicsResult.map(({dataValues})=>dataValues)
		console.log('sum: ', totalObj);
		const result = createTally(totalObj, topicsArray);
		console.log('result', result); 
	}catch(error){
		console.error('error in summing chart', error); 
	}
}
const createTally = (sumObject, topicsArray)=>{
	return topicsArray.map(({name, id})=>{
		const correct = sumObject[id]['correct'] || 0;
		const incorrect = sumObject[id]['incorrect'] || 0; 
		console.log(name,': ', correct, incorrect, correct / (correct+incorrect))
		return {[name]: correct / (correct + incorrect)}; 
	})
}
const sumTopics = (array, key, resultObj = {})=>{
	return array.reduce((result, {dataValues: topicsObj})=>{
		topicsObj.topics.forEach((topic)=>{
			result[topic] = result[topic] || {}; 
			result[topic][key] = result[topic][key] || 0; 
			result[topic][key] += Number(topicsObj[key]);
		})
	return result; 
	}, resultObj)
}

module.exports = {
	getBarChart
}