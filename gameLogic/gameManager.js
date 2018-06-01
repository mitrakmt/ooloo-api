const {pickInterest} = require('./util'); 

const setupGame = (player1Obj, player2Obj)=>{
	const interest = pickInterest(player1Obj, player2Obj); 
}

module.exports = {
	setupGame
}