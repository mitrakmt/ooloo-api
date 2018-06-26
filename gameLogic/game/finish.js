const {GET_USER_RANK} = require('../../models/user'); 
const {recordGameStart, recordGameFinish} = require('../record'); 

const gameFinished = async(gameObject)=>{
	gameObject.playersFinished++;
	const gameState = gameObject.getCurrentGameState(gameObject); 
	gameState.score = gameState.score.map((points)=>{
		return Math.round(points * (1 - ((gameObject.duration - gameState.remainingTime) / 1000 / 600)));
	});
	gameState.ranks = await getRank(gameObject.players); 
	gameObject.finishedTime = gameObject.players.map(({finishedTime})=> finishedTime);
	gameObject.state = gameState; 
	sendFinalResults(gameObject, gameState); 
	if(gameObject.playersFinished >= gameObject.numberOfPlayers || gameObject.outOfTime){
		recordGameFinish(gameObject); 
		tearDown(gameObject);
	}
};

const sendFinalResults = (gameObject, gameState)=>{
	const results = {
		...gameState,
		answers: gameObject.answers,
		gameID: gameObject.gameID,
		finishedTime: gameObject.finishedTime
	};
	gameObject.scoreState = gameState; 
	gameObject.players.forEach(({isFinished, socket})=>{
		if(isFinished === true || gameObject.outOfTime){
			socket.emit('gameResults', {...results});
		}
	});
};

const getRank = async(players)=>{
	let ranks = players.map(({id})=>GET_USER_RANK(id));
	ranks = await Promise.all(ranks);
	return ranks.map(({rank})=> rank); 
}

const tearDown = (gameObject)=>{
	gameObject.players.forEach(({socket})=>{
		socket.removeAllListeners('answer');
		socket.disconnect(true); 
	});
	clearTimeout(gameObject.timerID); 
};

const answeredAllQuestions = (socket, gameObject, player)=>{
	player.isFinished = true;
	player.finishedTime = Date.now() - gameObject.startTime;  
	gameFinished(gameObject);
};

const timerExpired = (gameObject)=>{
	gameObject.finishedTime = gameObject.finishedTime.map((time)=>{
		if(time === undefined){
			return Date.now(); 
		}
		return time; 
	});
	gameObject.players.forEach((player)=>{
		player.finishedTime = player.finishedTime || Date.now() - gameObject.startTime; 
	})
	gameObject.outOfTime = true; 
	gameFinished(gameObject);
};
const attachTimeLimit = (gameObject, config)=>{
	gameObject.timerID = setTimeout(()=>timerExpired(gameObject), config.duration); 
}

module.exports = {
	attachTimeLimit,
	answeredAllQuestions
}