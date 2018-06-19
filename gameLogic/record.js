const {Games, Answers, UsersGames, Users} = require('../db'); 

const recordGameStart = async(gameObject)=>{
	const game = await Games.create({topics: gameObject.interests});
	return game.dataValues.id; 
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
const recordPlayersWithScore = (gameId, playersArray, scoreArray, {_UsersGames = UsersGames} = {})=>{
	playersArray.forEach((userId, index)=>{
		const score = scoreArray[index]; 
		_UsersGames.create({userId, score, gameId});
	});
};

const recordAnswers = (gameId, playersArray, answersTuple, questionsArray, startTime, {_Answers = Answers} = {})=>{
	for(let i = 0; i < answersTuple.length; i++){
		const answersArray = answersTuple[i]; 
		let prevTime = startTime; 
		for(let j = 0; j < answersArray.length; j++){
			const answerObj = answersArray[j]; 
			const timeTaken = answerObj.answerTime - prevTime; 
			prevTime = answerObj.answerTime;
			const {questionId} = questionsArray[j];
			let {correct, answer: answered} = answerObj;
			const userId = playersArray[j]; 
			if(!Array.isArray(answered)){
				answered = [answered]; 
			}
			_Answers.create({timeTaken, gameId, userId, questionId, answered, correct})
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
