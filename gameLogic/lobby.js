const addPlayertoQueue = ()=>{

}

const playerConnects = (socket, {addPlayertoQueue = addPlayertoQueue})=>{
	addPlayertoQueue({socket}); 
}

module.exports = {
	addPlayertoQueue,
	playerConnects
}