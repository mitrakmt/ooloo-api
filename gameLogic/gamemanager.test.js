jest.mock('./util');
const util = require('./util'); 

const {setupGame} = require('./gameManager'); 

test("setupGame takes 2 lobbyPlayerObj and gather all required information",()=>{
	setupGame({},{}); 
	expect(util.pickInterest).toHaveBeenCalled(); 
});