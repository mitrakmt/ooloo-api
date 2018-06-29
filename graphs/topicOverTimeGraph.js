const {Questions, Interests, Answers, db} = require('../db');
const Sequelize = require('Sequelize');
const {Op} = Sequelize; 

const times = {
	week: 1000 * 60 * 60 * 24 * 7, 
	day: 1000 * 60 * 60 * 24
}

const getTopicsOverTime = async(userId, topicsArray, timeSpan = 'day')=>{
	try{
		const interestsIds = topicsArray.map(({id})=> id); 
		const results = await Answers.findAll({
			attributes:[
				'correct',
				[db.fn('COUNT', db.col('correct')), 'correctTotal'],
				[db.fn('date_trunc', timeSpan, db.col('answers.createdAt')), 'time']
			],
			include:{
				model: Questions,
				attributes: ['topics'],
				where:{topics:{[Op.overlap]: interestsIds}}
			},
			raw:true,
			group:['topics', 'correct', 'time'],
			where:{userId},
			order:[db.literal('time DESC'), 'correct']
		})
		const topicNameObj =  await getTopicsNames(results);
		const data = organizeData(results, topicNameObj, timeSpan)
		return { 
			time: timeSpan,
			data
		};
	}catch(error){
		console.error('error in getting line chart', error); 
	}
}

const getTopicsNames = async(answersArray)=>{
	const arraySet = answersArray.reduce((topicsSet, {'question.topics': topics})=>{
		topicsSet.add(topics);
		return topicsSet; 
	}, new Set())
	const topicsArray = Array.from(arraySet);
	const interestResult = await Interests.findAll({
		where:{id:{[Op.or]: topicsArray}},
		attributes: ['id','name']
	})
	return interestResult.reduce((totalObj, {dataValues:{id, name}})=>{
		totalObj[id] = name; 
		return totalObj; 
	}, {})
};

const organizeData = (answersArray, topicNameObj, timeSpan)=>{
	const interval = times[timeSpan];
	const now = new Date(); 
	const unSummedObj = answersArray.reduce((totalObj, {correct: isCorrect, correctTotal, time, 'question.topics':topicsIdArray})=>{
		const intervalIndex = Math.floor((now - time) / interval);
		const correctIncorrect = isCorrect ? 'correct' : 'incorrect'; 
		topicsIdArray.forEach((topicId)=>{
			const topic = topicNameObj[topicId];
			totalObj[topic] = totalObj[topic] || []; 
			let dataSpot = totalObj[topic]; 
			if(!dataSpot[intervalIndex]) dataSpot[intervalIndex] = {correct: 0, incorrect: 0}; 
			dataSpot[intervalIndex][correctIncorrect] += Number(correctTotal); 
		})
		return totalObj; 
	}, {});
	const data = {}; 
	for(let topic in unSummedObj){
		const valueArray = unSummedObj[topic];
		data[topic] = [];  
		for(let i = 0; i < valueArray.length; i++){
			const {correct = 0, incorrect = 0} = valueArray[i] || {}; 
			if(correct === 0 && incorrect === 0){
				data[topic][i] = null;
			}else{
				data[topic][i] = (correct / (correct + incorrect)); 
			}
		}
	}
	return data; 
}

module.exports = {getTopicsOverTime}