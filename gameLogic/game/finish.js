const {GET_USER_RANK} = require('../../models/user'); 
const {recordGameStart, recordGameFinish} = require('../record'); 
const {db, Users, Answers} = require('../../db');
const compileGraphs = require('./compileGraphs');

const gameFinished = async(gameObject)=>{
	gameObject.playersFinished++;
	const gameState = gameObject.getCurrentGameState(gameObject); 
	gameObject.state = gameState; 
	gameState.score = gameState.score.map((points)=>{
		return Math.round(points * (1 - ((gameObject.duration - gameState.remainingTime) / 1000 / 600)));
	});
	const graphDataPromise = compileGraphs(gameObject); 
	const rankPromise = getRank(gameObject.players); 
	const [graphData, ranks] = await Promise.all([graphDataPromise, rankPromise]);
	gameState.ranks = ranks
	gameObject.finishedTime = gameObject.players.map(({finishedTime})=> finishedTime);
	await sendFinalResults(gameObject, gameState, graphData); 
	if(gameObject.playersFinished >= gameObject.numberOfPlayers || gameObject.outOfTime){
		recordGameFinish(gameObject); 
		tearDown(gameObject);
	}
};

const sendFinalResults = async(gameObject, gameState, graphData)=>{
	await modifyIfSoloGame(gameObject, gameState); 
	const results = {
		...gameState,
		answers: gameObject.answers,
		gameID: gameObject.gameID,
		finishedTime: gameObject.finishedTime,
	};
	gameObject.scoreState = gameState; 
	gameObject.players.forEach(({isFinished, socket}, index)=>{
		if(isFinished === true || gameObject.outOfTime){
			socket.emit('gameResults', {
				...results,
				graphData: graphData[index]
			});
		}
	});
};

const getRank = async(players)=>{
	try{
		let ranks = players.map(({id})=>GET_USER_RANK(id));
		ranks = await Promise.all(ranks);
		return ranks.map(({rank})=> rank);
	}catch(error){
		console.error('error in getting rank:', error); 
	}
}

const modifyIfSoloGame = async(gameObject, gameState)=>{
	if(gameObject.isSoloGame){
		const averages = await getAverages()
		gameState.score.push(averages.score); 
		gameState.ranks.push(averages.rank); 
		gameObject.finishedTime.push(45 * 1000); 
		gameState.totalCorrect.push(averages.overall); 
	}
	return; 
}
const getAverages = async()=>{
	try{
		const scoreResultsPromise = db.query('SELECT AVG(score) from "UsersGames";')
		const numPlayersPromise = Users.count();
		const correctPromise = Answers.count({where:{correct:true}});
		const totalPromise = Answers.count();
		const [scoreResults, numPlayers, correct, total] = await Promise.all([scoreResultsPromise, numPlayersPromise, correctPromise, totalPromise]) 
		const finishedTime = 45 * 1000
		const rank = Math.floor(numPlayers / 2) + 1;
		const score = Math.floor(scoreResults[0][0].avg);
		const overall = Math.round((correct / total) * 100)/10; 
		return {score, finishedTime, rank,overall}; 
	}catch(error){
		console.error('error in get averages:', error); 
	}
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