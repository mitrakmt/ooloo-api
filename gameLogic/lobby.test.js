const {playerConnects, addPlayertoQueue} = require('./lobby'); 

jest.mock('../helpers/auth'); 
const {verifyToken} = require('../helpers/auth');
verifyToken.mockImplementation(()=> ({decoded:123}));

jest.mock('../models/interest');
const {GET_INTERESTS} = require('../models/interest');
GET_INTERESTS.mockImplementation(()=>['foo','bar']);


test("When a player connects, verify their id and get their interests",()=>{
	playerConnects({}, 'jwt');
	expect(verifyToken).toHaveBeenCalledWith('jwt'); 
});
test("A player's interests should be collected", ()=>{
	playerConnects({}, 'jwt'); 
	expect(GET_INTERESTS).toHaveBeenCalledWith(123); 
});

test("When a player connects, they should be put into a queue", ()=>{
	const socket = {};
	mockAddPlayer = jest.fn(); 
	playerConnects(socket, 'jwt', {addPlayertoQueue: mockAddPlayer}); 
	expect(mockAddPlayer).toHaveBeenCalledWith(expect.objectContaining({socket, id:123, interests:['foo','bar']})); 
}); 
