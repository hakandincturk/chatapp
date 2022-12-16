import { Server } from 'socket.io';

const socketPort = 5000;

class SocketServer {

	static start () {
		const io = new Server({
			cors: {
				origin: '*:*',
				methods: [ 'GET', 'POST' ],
				credentials: true
			}
		});
		console.log(` * SOCKET IS RUNNING ON ${socketPort}`);
  
		io.on('connection', socket => {
			console.log(`CONNECTION ON ${new Date()}`);
    
			const id = socket.handshake.query.id;
			socket.join(id);
    
			socket.on('send-message', ({ conversationId, recipients, text }) => {
				recipients.forEach(recipient => {
					const newRecipients = recipients.filter(r => r !== recipient);
					newRecipients.push(id);
					socket.broadcast.to(recipient).emit('receive-message', {
						conversationId,
						recipients: newRecipients, 
						sender: id, 
						text
					});
				});
			});
		});

		io.listen(socketPort);
	}
  
}

export default SocketServer;