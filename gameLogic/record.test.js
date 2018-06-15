const {appendWinner, recordAnswers, recordPlayersWithScore} = require('./record'); 

test('appendWinner should get the game, and then update who won',()=>{
	const playersArray = [1,2]; 
	const scoresArray = [13242,11000]; 
	const _Games = {
		update: jest.fn()
	};

	appendWinner(22, playersArray, scoresArray, {_Games});

	expect(_Games.update).toHaveBeenCalledWith({winner:1},{where:{id:22}});
});

test('recordPlayersWithScore should make a through row for players, games and final score', ()=>{
	const _UsersGames = { 
		create: jest.fn()
	};
	const playerArray = [4,5];
	const scoreArray = [123,456]; 

	recordPlayersWithScore(5, playerArray, scoreArray, {_UsersGames}); 

	expect(_UsersGames.create).toHaveBeenCalledWith({gameId: 5, playerId: 4, score: 123});
	expect(_UsersGames.create).toHaveBeenCalledWith({gameId: 5, playerId: 5, score: 456});
});

test('recordAnswers should save every answer', ()=>{
	const playersArray = [8,4];
	const answersTuple = [
		[{correct: true, answer: 'hello', answerTime:10}, {correct:true, answer:'foo', answerTime: 23}],
		[{correct: false, answer:'thign', answerTime: 23}, {correct:true, answer:'foo', answerTime: 44}]
	];
	const questionsArray = [{questionId: 4}, {questionId: 22}]
	const _Answers = {
		create: jest.fn()
	};

	recordAnswers(2, playersArray, answersTuple, questionsArray, 0, {_Answers});

	expect(_Answers.create).toHaveBeenCalledWith({gameId:2, playerId: 8, questionId:4, correct:true, answered:['hello'], timeTaken:10});
	expect(_Answers.create).toHaveBeenCalledWith({gameId:2, playerId: 8, questionId:22, correct:true, answered:['foo'], timeTaken:13});
	expect(_Answers.create).toHaveBeenCalledWith({gameId:2, playerId: 4, questionId:4, correct:false, answered:['thign'], timeTaken:23});
	expect(_Answers.create).toHaveBeenCalledWith({gameId:2, playerId: 4, questionId:22, correct:true, answered:['foo'], timeTaken:21});
});