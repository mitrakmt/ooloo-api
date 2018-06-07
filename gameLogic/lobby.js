const {verifyToken} = require('../helpers/auth'); 
const { GET_INTERESTS } = require('../models/interest');
const {findOpponent} = require('./util');
const mockQuestions = require('./mockQuestions');
const {setupGame} = require('./gameManager'); 

const playerQueue = []; 

const addPlayerToQueue = (playerObj)=>{
	playerQueue.push(playerObj); 
};
const removePlayerFromQueue = (index)=>{
	playerQueue.splice(index, 1); 
};
const getQuestions = (interests)=>{
	return mockQuestions;
};
const queueOrMatch = (playerObj, {_playerQueue = playerQueue, _getQuestions = getQuestions, _removePlayerFromQueue = removePlayerFromQueue, _addPlayerToQueue = addPlayerToQueue} = {})=>{
	const playerInterests = playerObj.interests;
	const opponentInterests = _playerQueue.map(({interests})=> interests);

	const match = findOpponent(playerInterests, opponentInterests);
	if(match === null){
		_addPlayerToQueue(playerObj);
	}else{
		const opponent = _playerQueue[match.index];
		const gameObject = {
			interests: match.interests,
			players: [opponent, playerObj]
		};
		_removePlayerFromQueue(match.index); 
		gameObject.questions = _getQuestions(gameObject.interests);
		setupGame(gameObject); 
	}
};
const botGame = (playerObj)=>{
	const gameObject = {
			interests: ['foo', 'bar'],
			players: [playerObj],
			questions: mockQuestions
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
		const playerObject = {socket, id, interests};
		//_queueOrMatch(playerObject); 
		botGame(playerObject); 
	}catch(error){
		console.error(error); 
	}
};


module.exports = {
	addPlayerToQueue,
	playerConnects,
	queueOrMatch
}