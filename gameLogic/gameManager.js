const {pickInterest} = require('./util'); 
const config = {
	duration: 1000 * 60 * 5,
	questions: 10 
};

const setupGame = (gameObject, _config = config)=>{
	const {players} = gameObject;
	gameObject.startTime = Date.now();
	gameObject.finishedTime = new Array(2); 
	gameObject.answers = createAnswerArray(gameObject.questions.length);
	players.forEach(({socket}, index)=>{
		//What other info should this have?
		socket.emit('gameStart', 
		{
			startTime: Date.now(),
			duration: _config.duration,
			questions: _config.questions,
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
const createAnswerArray = (questions)=>{
	const array = [];
	for(let i = 0; i < questions; i++){
		array.push({}); 
	}
	return array;
};
//TODO Currently tears down when one player finishes.
const gameFinished = (gameObject)=>{
	sendFinalResults(gameObject); 
	tearDown(gameObject); 
};
const sendFinalResults = (gameObject)=>{
	const results = {
		answers: gameObject.answers
	};
	gameObject.players.forEach(({socket})=>{
		socket.emit('results', {results});
	});
};
const tearDown = (gameObject)=>{
	gameObject.players.forEach(({socket})=>{
		socket.removeAllListeners('answer');
		socket.disconnect(true); 
	});
};
const answerReceived = (socket, playerIndex, answer, questionNumber, gameObject)=>{
	const resultsObj = checkAnswer(questionNumber, answer, playerIndex, gameObject);
	sendResults(resultsObj, gameObject);
	console.log(questionNumber, gameObject.questions.length); 
	if(questionNumber + 1 >= gameObject.questions.length){
		answeredAllQuestions(socket, gameObject); 
	}else{
		sendQuestion(socket, questionNumber + 1, gameObject);
	}
};
const sendResults = (resultsObj, gameObject)=>{
	gameObject.players.forEach(({socket})=>{
		socket.emit('answerResult', resultsObj); 
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
	checkAnswer
};