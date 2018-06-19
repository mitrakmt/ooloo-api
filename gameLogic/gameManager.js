const {pickInterest} = require('./util'); 
const {recordGameStart, recordGameFinish} = require('./record'); 
const {GET_USER_RANK} = require('../models/user'); 
const config = {
	//duration: 1000 * 60 * 5,
	duration: 1000 * 60 * 5,
	questions: 10, 
	pointsPerQuestion: 1000
};

const setupGame = async(gameObject, _config = config)=>{
	const {players} = gameObject;
	gameObject.startTime = Date.now();
	gameObject.duration = _config.duration; 
	gameObject.finishedTime = new Array(2); 
	gameObject.pointsPerQuestion = _config.pointsPerQuestion; 
	gameObject.answers = createAnswerArray(gameObject.questions.length);
	gameObject.gameID = await recordGameStart(gameObject);
	gameObject.numberOfPlayers = gameObject.players.length;
	gameObject.playersFinished = 0; 
	gameObject.timerID = setTimeout(()=>timerExpired(gameObject), config.duration); 
	players.forEach(({socket}, index)=>{
		socket.emit('gameStart', 
		{
			startTime: Date.now(),
			duration: _config.duration,
			numberOfQuestions: _config.questions,
			playerIndex: index,
			usernames: players.map(({username})=> username )
		});
		sendQuestion(socket, 0, gameObject); 
		socket.on('answer', ({answer, questionNumber})=>{
			answerReceived(socket, index, answer, questionNumber, gameObject);
		});
	});
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
		array.push([]); 
	}
	return array;
};


const gameFinished = async(gameObject)=>{
	gameObject.playersFinished++;
	const gameState = getCurrentGameState(gameObject); 
	gameState.score = gameState.score.map((points)=>{
		return Math.round(points * (1 - ((gameObject.duration - gameState.remainingTime) / 1000 / 600)));
	});
	gameState.ranks = await getRank(gameObject.players); 
	gameObject.state = gameState; 
	sendFinalResults(gameObject, gameState); 
	if(gameObject.playersFinished >= gameObject.numberOfPlayers || gameObject.outOfTime){
		recordGameFinish(gameObject); 
		tearDown(gameObject);
	}
};
const getRank = async(players)=>{
	let ranks = players.map(({id})=>GET_USER_RANK(id));
	ranks = await Promise.all(ranks);
	return ranks; 
}
const sendFinalResults = (gameObject, gameState)=>{
	const results = {
		...gameState,
		answers: gameObject.answers,
		gameID: gameObject.gameID
	};
	gameObject.scoreState = gameState; 
	gameObject.players.forEach(({isFinished, socket})=>{
		if(isFinished === true || gameObject.outOfTime){
			socket.emit('gameResults', {...results});
		}
	});
};
const tearDown = (gameObject)=>{
	gameObject.players.forEach(({socket})=>{
		socket.removeAllListeners('answer');
		socket.disconnect(true); 
	});
	clearTimeout(gameObject.timerID); 
};
const answerReceived = (socket, playerIndex, answer, questionNumber, gameObject)=>{
	const player = gameObject.players[playerIndex];
	if(!player.isFinished){
		const answerObj = checkAnswer(questionNumber, answer, playerIndex, gameObject);
		const scoreObj = getCurrentGameState(gameObject); 
		sendResults({...answerObj, ...scoreObj}, gameObject);
		if(questionNumber + 1 >= gameObject.questions.length){
			answeredAllQuestions(socket, gameObject, player); 
		}else{
			sendQuestion(socket, questionNumber + 1, gameObject);
		}
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
	//THIS NEEDS TO BE UPDATED ONCE YOU HAVE MULTIPLE ANSWER TYPES
	const correct = (correctAnswer[0] === answer);
	const answerObj = gameObject.answers[questionNumber];
	
	answerObj[playerIndex] = {correct, answer, answerTime: Date.now()};
	return {correct, playerIndex, questionNumber};
};
//TODO: Currently ends when one player finishes. Fine for now, modifiy for multiple players
const answeredAllQuestions = (socket, gameObject, player)=>{
	player.isFinished = true;
	player.finishedTime = Date.now();  
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
	gameObject.outOfTime = true; 
	gameFinished(gameObject);
};
module.exports = {
	setupGame,
	checkAnswer,
	getCurrentGameState
};