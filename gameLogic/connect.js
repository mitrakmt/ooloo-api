const {playerConnects} = require('./lobby'); 

module.exports = (io)=>{
	io.on('connection', (socket)=>{
		const token = socket.handshake.query.token; 
		playerConnects(socket, token);
	});
}