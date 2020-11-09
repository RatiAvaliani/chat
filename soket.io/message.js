const {message: messageModule} = require('../schemas/message.schema');
const user = require('../models/login.model'); 

class message {
    socket;

    static userInfo;

    static connect (req, res, token) {
        message.userInfo = user.getInfo(req, res);

        global.io.on('connect', (socket) => { 
            if (token === socket.handshake.query.token) {
                new message(socket);
            }   
           // global.io.close();         
        });

        return message.userInfo;
    }

    constructor (socket) {
        this.socket = socket;

        this.save();
        this.getHistory();
        
        return;
    }

    getHistory () {
        //console.log(this.socket.res.client);
        this.socket.on('getHistory', (info) => {
                (async () => { 
    
                    let messages = await messageModule.find({ 
                        $or: [
                            {
                                fromUserId: info.from,
                                toUserId: info.to
                            },
                            {
                                fromUserId: info.to,
                                toUserId: info.from
                            }
                        ]
                    });
                    
                    this.socket.emit('userHistory', messages);
                })();
            });
    }

    save () { 
        this.socket.on('saveMessage', (info) => {
                messageModule({
                    fromUserId: info.from,
                    toUserId: info.to, 
                    message: info.mess
                }).save();

                global.io.sockets.emit('broadcast', {
                    fromUserId: info.from,
                    toUserId: info.to, 
                    message: info.mess
                });
        });
    }
}

module.exports = (req, res, token) => message.connect(req, res, token);