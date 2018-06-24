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
const recordPlayersWithScore = async(gameId, playersArray, scoreArray, {_UsersGames = UsersGames} = {})=>{
	try{
		const scorePromises = playersArray.map((userId, index)=>{
			const score = scoreArray[index]; 
			return _UsersGames.create({userId, score, gameId});
		});
		await Promise.all(scorePromises);
		playersArray.forEach((userId)=>updatePlayerScore(userId)); 
	}catch(error){
		console.error('recrdPlayersWithScore error: ', error); 
	}
};

const updatePlayerScore = async(userId)=>{
	try{
		const points = await UsersGames.sum('score', {where:{userId}});
		Users.update({points}, {where:{id: userId}});
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
