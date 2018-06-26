const {Games, Answers, UsersGames, Users, Schools, UsersSchools} = require('../db'); 
const Sequelize = require('sequelize'); 

const recordGameStart = async(gameObject)=>{
	try{
		const topics = gameObject.interests.map(({id})=>id);
		const game = await Games.create({topics});
		return game.dataValues.id; 
	}catch(error){
		console.error('error recordding game', error); 
	}
};

const recordGameFinish = (gameObject)=>{
	const players = gameObject.players.map(({id})=> id);
	appendWinner(gameObject.gameID, players, gameObject.state.score); 
	recordPlayersWithScore(gameObject.gameID, players, gameObject.state.score);
	recordAnswers(gameObject.gameID, players, gameObject.answers, gameObject.questions, gameObject.startTime);
};
const appendWinner = (id, playersArray, scoreArray, {_Games = Games} = {})=>{
	const {index: winnerIndex} = scoreArray.reduce((total, current, index)=>{
		const {highest} = total; 
		if(current > highest) return {highest: current, index}; 
		return total; 
	},{highest:0, index: 0});
	const winnerID = playersArray[winnerIndex];
	_Games.update({winner: winnerID}, {where:{id}});
};
const recordPlayersWithScore = async(gameId, playersArray, scoreArray, {_UsersGames = UsersGames} = {})=>{
	try{
		const scorePromises = playersArray.map((userId, index)=>{
			const score = scoreArray[index]; 
			return _UsersGames.create({userId, score, gameId});
		});
		await Promise.all(scorePromises);
		playersArray.forEach((userId)=> updateScores(userId)); 
	}catch(error){
		console.error('recrdPlayersWithScore error: ', error); 
	}
};

const updateScores = async(userId)=>{
	await updatePlayerScore(userId); 
	updatePlayersSchoolScore(userId)
}

const updatePlayersSchoolScore = async(userId)=>{
	try{
		const {dataValues:{university}} = await Users.findOne({
			where:{id:userId},
			attributes:['university']
		})
		const points = await Users.sum('points', {where:{university}})
		Schools.update({points}, {where:{name: university}});
	}catch(error){
		console.error('updating school score error:', error);
	}
}

const updatePlayerScore = async(userId)=>{
	try{
		const points = await UsersGames.sum('score', {where:{userId}});
		await Users.update({points}, {where:{id: userId}});
	}catch(error){
		console.error('updating player score error: ', error); 
	}
}

const recordAnswers = (gameId, playersArray, answersArray, questionsArray, startTime, {_Answers = Answers} = {})=>{
	for(let i = 0; i < answersArray.length; i++){
		const playerTuple = answersArray[i]; 
		let prevTime = startTime; 
		for(let j = 0; j < playerTuple.length; j++){
			const answerObj = playerTuple[j]; 
			if(answerObj){
				const timeTaken = answerObj.answerTime - prevTime; 
				prevTime = answerObj.answerTime;
				const {questionId} = questionsArray[i];
				let {correct, answer: answered} = answerObj;
				const userId = playersArray[j]; 
				if(!Array.isArray(answered)){
					answered = [answered]; 
				}
				_Answers.create({timeTaken, gameId, userId, questionId, answered, correct})
			}
		}
	}
};


module.exports = {
	recordGameFinish,
	recordGameStart,
	appendWinner,
	recordAnswers,
	recordPlayersWithScore
};
