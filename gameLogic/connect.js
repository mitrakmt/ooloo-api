const {playerConnects} = require('./lobby'); 

module.exports = (io)=>{
	io.on('connection', (socket)=>{
		const token = socket.handshake.query.token; 
		console.log("connected with ", token); 
		playerConnects(socket, token);
		socket.on('test', (message)=>{
			console.log(message); 
		}); 
	});
}