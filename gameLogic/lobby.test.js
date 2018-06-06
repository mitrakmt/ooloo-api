jest.mock('../helpers/auth',()=>{
	return{
		verifyToken: jest.fn(()=> ({decoded: {id:123}}))
	};
});
const {verifyToken} = require('../helpers/auth');

jest.mock('../models/interest', ()=>{
	return {
		GET_INTERESTS: jest.fn(()=> ['foo','bar'])
	};
});
const { GET_INTERESTS } = require('../models/interest');

jest.mock('./util', ()=>{
	return{
		getQuestions: jest.fn(()=>['foo','bar','baz']),
		findOpponent: jest.fn(()=> null)
	};
});
const {getQuestions, findOpponent} = require('./util');

jest.mock('./gameManager', ()=>{
	return{
		setupGame: jest.fn()
	};
});
const {setupGame} = require('./gameManager'); 


const { playerConnects, addPlayertoQueue, createGame, queueOrMatch } = require('./lobby');


test("When a player connects, verify their id and get their interests", async() => {
    await playerConnects({}, 'jwt');
    expect(verifyToken).toHaveBeenCalledWith('jwt');
});

test("A player's interests should be collected", () => {
    playerConnects({}, 'jwt');
    expect(GET_INTERESTS).toHaveBeenCalledWith(123);
});

test("When a player connects, we should check if they get a match or are put into a queue", async() => {
    const socket = {};
    mockQueueOrMatch = jest.fn();

    await playerConnects(socket, 'jwt', { _queueOrMatch: mockQueueOrMatch });
    
    expect(mockQueueOrMatch).toHaveBeenCalledWith(expect.objectContaining({ socket, id: 123, interests: ['foo', 'bar'] }));
});

test("When a players is placed a match should be created if they have similar interests",()=>{
	const player1 = {
		interests:['foo', 'bar']
	};
	const _playerQueue = [{
		interests:['foo']
	}];
	const _removePlayerFromQueue = jest.fn(); 
	findOpponent.mockImplementation(()=> ({interests:['foo'], index:0}));

	queueOrMatch(player1, {_playerQueue, _removePlayerFromQueue});

	expect(setupGame).toHaveBeenCalled();
	expect(_removePlayerFromQueue).toHaveBeenCalledWith(0); 
});



test("queueOrMatch, When a player has no matches, they should be put into the queue",()=>{
	const player1 = {
		interests:['baz', 'bar']
	};
	const _playerQueue = [{
		interests:['foo']
	}];
	const _setupGame = jest.fn(); 
	const _addPlayerToQueue = jest.fn(); 
	findOpponent.mockImplementation(()=> null);

	queueOrMatch(player1, {_playerQueue, _addPlayerToQueue, _setupGame});

	expect(_setupGame).not.toHaveBeenCalled(); 
	expect(_addPlayerToQueue).toHaveBeenCalledWith(player1);
});