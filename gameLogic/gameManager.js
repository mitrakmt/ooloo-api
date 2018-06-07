const {pickInterest} = require('./util'); 
const config = {
	duration: 1000 * 60 * 5,
	questions: 10, 
	pointsPerQuestion: 1000
};

const setupGame = (gameObject, _config = config)=>{
	const {players} = gameObject;
	gameObject.startTime = Date.now();
	gameObject.duration = _config.duration; 
	gameObject.finishedTime = new Array(2); 
	gameObject.pointsPerQuestion = _config.pointsPerQuestion; 
	gameObject.answers = createAnswerArray(gameObject.questions.length);
	gameObject.gameID = getGameID(); 
	players.forEach(({socket}, index)=>{
		//What other info should this have?
		socket.emit('gameStart', 
		{
			startTime: Date.now(),
			duration: _config.duration,
			numberOfQuestions: _config.questions,
			playerIndex: index
		});
		sendQuestion(socket, 0, gameObject); 
		socket.on('answer', ({playerIndex, answer, questionNumber})=>{
			answerReceived(socket, playerIndex, answer, questionNumber, gameObject);
		});
	});
	const timerID = setTimeout(()=>timerExpired(gameObject), config.duration); 
};


//recieve answer
	//if correct
		//add points
	//send current game state to both players, (including results of question)
	//record answers in results obj
	//send next question

//TODO get actual game ID when saving games. 
const getGameID = ()=>{
	return 1; 
};
const createAnswerArray = (questions)=>{
	const array = [];
	for(let i = 0; i < questions; i++){
		array.push([]); 
	}
	return array;
};
//TODO Currently tears down when one player finishes.
const gameFinished = (gameObject)=>{
	sendFinalResults(gameObject); 
	tearDown(gameObject); 
};
const sendFinalResults = (gameObject)=>{
	const gameState = getCurrentGameState(gameObject); 
	gameState.score = gameState.score.map((points)=>{
		return Math.round(points * (1 - ((gameObject.duration - gameState.remainingTime) / 1000 / 600)));
	});
	const results = {
		...gameState,
		answers: gameObject.answers,
		gameID: gameObject.gameID
	};
	gameObject.players.forEach(({socket})=>{
		socket.emit('gameResults', {results});
	});
};
const tearDown = (gameObject)=>{
	gameObject.players.forEach(({socket})=>{
		socket.removeAllListeners('answer');
		socket.disconnect(true); 
	});
};
const answerReceived = (socket, playerIndex, answer, questionNumber, gameObject)=>{
	const answerObj = checkAnswer(questionNumber, answer, playerIndex, gameObject);
	const scoreObj = getCurrentGameState(gameObject); 
	sendResults({...answerObj, ...scoreObj}, gameObject);
	if(questionNumber + 1 >= gameObject.questions.length){
		answeredAllQuestions(socket, gameObject); 
	}else{
		sendQuestion(socket, questionNumber + 1, gameObject);
	}
};
const getCurrentGameState = (gameObject)=>{ 
	const remainingTime = gameObject.duration - (Date.now() - gameObject.startTime);
	const score = gameObject.answers.reduce(({score, totalCorrect, totalAnswered}, answerArray)=>{
		answerArray.forEach(({correct}, index)=>{
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
		});
		return {score, totalCorrect, totalAnswered}; 
	}, {score:[], totalCorrect: [], totalAnswered: []});
	return {remainingTime, ...score};
};
const sendResults = (resultsObj, gameObject)=>{
	gameObject.players.forEach(({socket})=>{
		socket.emit('answerResults', resultsObj); 
	});
};
const checkAnswer = (questionNumber, answer, playerIndex, gameObject)=>{
	const correctAnswer = gameObject.questions[questionNumber].answer;
	const correct = (correctAnswer === answer);
	const answerObj = gameObject.answers[questionNumber];
	
	answerObj[playerIndex] = {correct, answer};
	return {correct, playerIndex, questionNumber};
};
//TODO: Currently ends when one player finishes. Fine for now, modifiy for multiple players
const answeredAllQuestions = (socket, gameObject, timerID)=>{
	clearTimeout(timerID);
	gameFinished(gameObject);
};
const sendQuestion = (socket, questionNumber, gameObject)=>{
	const {question, possibleAnswers} = gameObject.questions[questionNumber];
	socket.emit('question', {question, possibleAnswers, questionNumber});
};
const timerExpired = (gameObject)=>{
	gameObject.finishedTime = gameObject.finishedTime.map((time)=>{
		if(time === undefined){
			return Date.now(); 
		}
		return time; 
	});
	gameFinished(gameObject);
};
module.exports = {
	setupGame,
	checkAnswer,
	getCurrentGameState
};