const {verifyToken} = require('../helpers/auth'); 
const { GET_INTERESTS } = require('../models/interest');
const {findOpponent} = require('./util');
const mockQuestions = require('./mockQuestions');
const {setupGame} = require('./gameManager'); 
const {botTimer} = require('./gameConfig');
const {GET_QUESTIONS, GET_BIASED_QUESTIONS} = require('../models/question');
const {GET_USER} = require('../models/user');

const playerQueue = []; 

const addPlayerToQueue = (playerObj)=>{
	playerQueue.push(playerObj);
	handleDisconnect(playerObj, playerObj.socket); 
};
const removePlayerFromQueue = (index)=>{
	const player = playerQueue[index]; 
	playerQueue.splice(index, 1); 
};
const getQuestions = async(interests, playersArray)=>{
	const questions = await GET_BIASED_QUESTIONS(interests, playersArray); 
	return questions; 
};
const queueOrMatch = async(playerObj, {_startBotGameTimer = startBotGameTimer, _playerQueue = playerQueue, _getQuestions = getQuestions, _removePlayerFromQueue = removePlayerFromQueue, _addPlayerToQueue = addPlayerToQueue} = {})=>{
	//_playerQueue = playerQueue.filter(({socket})=> socket.connected);
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
		gameObject.questions = await _getQuestions(gameObject.interests, gameObject.players);
		setupGame(gameObject); 
	}
};
const botGame = async(playerObj)=>{
	const questions = await getQuestions(playerObj.interests, [playerObj]); 
	const gameObject = {
			interests: playerObj.interests,
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
		const interests = await GET_INTERESTS(id); 
		console.log(interests); 
		const {username} = await GET_USER(id); 
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

const handleDisconnect = (player, socket)=>{
	socket.on('disconnect',()=>{
		const index = playerQueue.indexOf(player);
		if(index >= 0){
			removePlayerFromQueue(index); 
		}			
	})
}


module.exports = {
	addPlayerToQueue,
	playerConnects,
	queueOrMatch
};
