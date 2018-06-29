const {verifyToken} = require('../helpers/auth'); 
const { GET_INTERESTS } = require('../models/interest');
const {findOpponent} = require('./util');
const mockQuestions = require('./mockQuestions');
const {setupGame} = require('./gameManager'); 
const {botTimer, matchFoundTimer} = require('./gameConfig');
const {GET_QUESTIONS, GET_BIASED_QUESTIONS} = require('../models/question');
const {GET_USER} = require('../models/user');
const {Interests} = require('../db'); 

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
	try{
		const categories = interests.map(({id})=> id);
		const questions = await GET_BIASED_QUESTIONS(categories, playersArray); 
		return questions; 
	}catch(error){
		console.error('Error in getQuestions lobby:', error); 
	}
};
const matchFound = (gameObject)=>{
	console.log('match found'); 
	const usernames = gameObject.players.map(({username})=> username);
	if(usernames.length === 1) usernames.push('Average Scores: ') 
	const interests = gameObject.interests.map(({name})=>name);
	gameObject.players.forEach(({socket}, playerIndex)=>{
		socket.emit('matchFound', {
			interests,
			usernames,
			playerIndex
		})
	}); 
	setTimeout(()=> setupGame(gameObject), matchFoundTimer);
}
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
		matchFound(gameObject); 
	}
};
const botGame = async(playerObj)=>{
	const questions = await getQuestions(playerObj.interests, [playerObj]); 
	const gameObject = {
			interests: playerObj.interests,
			players: [playerObj],
			questions
		};
	matchFound(gameObject); 
};
const playerConnects = async(socket, token, {id, _queueOrMatch = queueOrMatch} = {})=>{
	try{
		const {decoded:{id}, error} = await verifyToken(token);
		if(error){
			throw error; 
		}
		let interests = await getInterests(id); 
		const {username} = await GET_USER(id); 
		const playerObject = {socket, id, interests, username};
		_queueOrMatch(playerObject); 
		//botGame(playerObject); 
	}catch(error){
		console.error("Error in player connecting: ", error); 
	}
};

const getInterests = async(id)=>{
	let interests = await GET_INTERESTS(id); 
	interests = interests.map(({id, name})=>({id,name}));
	if(interests.length === 0){
		interests = await Interests.findAll({});
		interests = interests.map(({dataValues:{id, name}})=>({id, name}))
	}
	return interests;
}

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
