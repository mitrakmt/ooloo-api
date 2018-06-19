const {verifyToken} = require('../helpers/auth'); 
const { GET_INTERESTS } = require('../models/interest');
const {findOpponent} = require('./util');
const mockQuestions = require('./mockQuestions');
const {setupGame} = require('./gameManager'); 
const {GET_QUESTIONS} = require('../models/question');
const {GET_USER} = require('../models/user');

const playerQueue = []; 

const botTimer = 1000 * 15; 

const addPlayerToQueue = (playerObj)=>{
	playerQueue.push(playerObj); 
};
const removePlayerFromQueue = (index)=>{
	playerQueue.splice(index, 1); 
};
const getQuestions = async(interests)=>{
	const questions = await GET_QUESTIONS(interests); 
	return questions; 
};
const queueOrMatch = async(playerObj, {_startBotGameTimer = startBotGameTimer, _playerQueue = playerQueue, _getQuestions = getQuestions, _removePlayerFromQueue = removePlayerFromQueue, _addPlayerToQueue = addPlayerToQueue} = {})=>{
	const playerInterests = playerObj.interests;
	const opponentInterests = _playerQueue.map(({interests})=> interests);

	const match = findOpponent(playerInterests, opponentInterests);
	if(match === null){
		_startBotGameTimer(playerObj); 
		_addPlayerToQueue(playerObj);
	}else{
		const opponent = _playerQueue[match.index];
		clearTimeout(opponent.botTimerID); 
		const gameObject = {
			interests: match.interests,
			players: [opponent, playerObj]
		};
		_removePlayerFromQueue(match.index); 
		gameObject.questions = await _getQuestions(gameObject.interests);
		setupGame(gameObject); 
	}
};
const botGame = async(playerObj)=>{
	const questions = await getQuestions(playerObj.interests); 
	const gameObject = {
			interests: ['foo', 'bar'],
			players: [playerObj],
			questions
		};
	setupGame(gameObject); 
};
const playerConnects = async(socket, token, {id, _queueOrMatch = queueOrMatch} = {})=>{
	try{
		const {decoded:{id}, error} = await verifyToken(token);
		if(error){
			throw error; 
		}
		//TODO put back when interests are more of a thing
		//const interests = await GET_INTERESTS(id); 
		const {username} = await GET_USER(id); 
		const interests = ['doctoring']; 
		const playerObject = {socket, id, interests, username};
		_queueOrMatch(playerObject); 
		//botGame(playerObject); 
	}catch(error){
		console.error(error); 
	}
};

const startBotGameTimer = (playerObj)=>{
	const timerID = setTimeout(()=>{
		const playerIndex = playerQueue.indexOf(playerObj);
		if(playerIndex >= 0){
			removePlayerFromQueue(playerIndex);
			botGame(playerObj); 
		}
	}, botTimer)
	playerObj.botTimerID = timerID; 
}

module.exports = {
	addPlayerToQueue,
	playerConnects,
	queueOrMatch
};
