const {pickInterest} = require('./util'); 
const {setupGameObject, startGame} = require('./game/start'); 
const {attachTimeLimit, answeredAllQuestions} = require('./game/finish'); 
const config = require('./gameConfig'); 

const setupGame = async(gameObject, _config = config)=>{
	try{
		gameObject.getCurrentGameState = getCurrentGameState; 
		const {players} = gameObject;
		attachAnswerListeners(players, gameObject);
		attachTimeLimit(gameObject, _config); 
		await setupGameObject(gameObject, _config);
		startGame(players, gameObject, _config, sendQuestion); 
	}catch(error){
		console.error('Error in game: ', error); 
	}
};

const attachAnswerListeners = (players, gameObject)=>{
	players.forEach(({socket}, index)=>{
		socket.on('answer', ({answer, questionNumber})=>{
			answerReceived(socket, index, answer, questionNumber, gameObject);
		});
	})
}
const answerReceived = (socket, playerIndex, answer, questionNumber, gameObject)=>{
	const player = gameObject.players[playerIndex];
	if(!player.isFinished){
		const answerObj = checkAnswer(questionNumber, answer, playerIndex, gameObject);
		const scoreObj = getCurrentGameState(gameObject); 
		sendResults({...answerObj, ...scoreObj}, gameObject);
		if(questionNumber + 1 >= gameObject.questions.length){
			answeredAllQuestions(socket, gameObject, player, getCurrentGameState); 
		}else{
			sendQuestion(socket, questionNumber + 1, gameObject);
		}
	}
};
const checkAnswer = (questionNumber, answer, playerIndex, gameObject)=>{
	const correctAnswer = gameObject.questions[questionNumber].answer;
	//THIS NEEDS TO BE UPDATED ONCE YOU HAVE MULTIPLE ANSWER TYPES
	const correct = (correctAnswer[0] === answer);
	const answerObj = gameObject.answers[questionNumber];
	
	answerObj[playerIndex] = {correct, answer, answerTime: Date.now()};
	return {correct, playerIndex, questionNumber};
};
const getCurrentGameState = (gameObject)=>{ 
	const remainingTime = gameObject.duration - (Date.now() - gameObject.startTime);
	const score = gameObject.answers.reduce(({score, totalCorrect, totalAnswered}, answerArray)=>{
		answerArray.forEach((answer, index)=>{
			if(answer !== null){
				const {correct} = answer; 
				score[index] = score[index] || 0; 
				totalCorrect[index] = totalCorrect[index] || 0; 
				totalAnswered[index] = totalAnswered[index] || 0; 
				if(correct === true) {
					score[index] += gameObject.pointsPerQuestion;
					totalCorrect[index]++; 
				}
				if(correct === true || correct === false){
					totalAnswered[index]++; 
				}
			}
		});
		return {score, totalCorrect, totalAnswered}; 
	}, {score:[], totalCorrect: [], totalAnswered: []});
	return {remainingTime, ...score};
};
const sendQuestion = (socket, questionNumber, gameObject)=>{
	const {question, possibleAnswers} = gameObject.questions[questionNumber];
	socket.emit('question', {question, possibleAnswers, questionNumber});
};
const sendResults = (resultsObj, gameObject)=>{
	gameObject.players.forEach(({socket})=>{
		socket.emit('answerResults', resultsObj); 
	});
};


module.exports = {
	setupGame,
	checkAnswer,
	getCurrentGameState
};