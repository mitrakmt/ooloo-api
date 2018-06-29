const {getAveragesGraph} = require('../../graphs/averageTopicBarGraph');
const {geMatchHistoryGraph} = require('../../graphs/opponentLineGraph');
const {getTopicsOverTime} = require('../../graphs/topicOverTimeGraph');

const compileGraphs = async(gameObject)=>{
	const graphPromises =  gameObject.players.map((player, index)=>{
		return getGraphs(gameObject, player, index); 
	})
	return await Promise.all(graphPromises); 
};

const getGraphs = async(gameObject, player, playerIndex)=>{
	try{
		const averagesPromise = getAveragesGraph(player.id, gameObject.interests);
		const topicsOverTimePromise = getTopicsOverTime(player.id, gameObject.interests);
		const promisesArray = [averagesPromise, topicsOverTimePromise]
		isSinglePlayer(gameObject, player, playerIndex, promisesArray);
		const [averagesByInterest, interestsOverTime, matchHistory] = await Promise.all(promisesArray);
		const graphObj = {averagesByInterest, interestsOverTime}; 
		if(!gameObject.isSoloGame) graphObj.matchHistory = matchHistory; 
		return graphObj
	}catch(error){
		console.error('-================_-=+-_-+=',error);
	}
}

const isSinglePlayer = (gameObject, player, playerIndex, promisesArray)=>{
	if(!gameObject.isSoloGame){
		const opponentIndex = (playerIndex === 0) ? 1 : 0; 
		const opponent = gameObject.players[opponentIndex]; 
		const didYouWin = gameObject.state.score[playerIndex] > gameObject.state.score[opponentIndex]; 
		const matchHistoryPromise = geMatchHistoryGraph(player.id, opponent.id, didYouWin); 
		promisesArray.push(matchHistoryPromise)
	}else{
		promisesArray.push(null); 
	}
}

module.exports = compileGraphs;