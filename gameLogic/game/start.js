const {makeNullArray, makeEmptyObjArray} = require('../util'); 
const {recordGameStart} = require('../record'); 

const setupGameObject = async(gameObject, _config)=>{
	const {players} = gameObject;
	gameObject.startTime = Date.now();
	gameObject.duration = _config.duration; 
	gameObject.finishedTime = makeNullArray(players.length); 
	gameObject.pointsPerQuestion = _config.pointsPerQuestion; 
	gameObject.answers = createAnswerArray(gameObject.questions.length, players.length);
	gameObject.gameID = await recordGameStart(gameObject);
	gameObject.numberOfPlayers = gameObject.players.length;
	gameObject.playersFinished = 0;
	players.forEach((player)=> player.location = 'game');
}

const startGame = (players, gameObject, config, sendQuestion)=>{
	const usernames = players.map(({username})=> username );
	if(usernames.length === 1){
		usernames.push('Average Scores: '); 
		gameObject.isSoloGame = true; 
	} 
	players.forEach(({socket}, index)=>{
		socket.emit('gameStart', 
		{
			startTime: Date.now(),
			duration: config.duration,
			numberOfQuestions: config.questions,
			playerIndex: index,
			usernames
		});
		sendQuestion(socket, 0, gameObject); 
	});
}


const createAnswerArray = (questions, numberOfPlayers)=>{
	const array = [];
	for(let i = 0; i < questions; i++){
		array.push(makeNullArray(numberOfPlayers)); 
	}
	return array;
};

module.exports = {
	setupGameObject, 
	startGame
}