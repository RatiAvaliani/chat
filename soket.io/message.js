const io = require('socket.io')(global.config.ports.SOKET);
const {message: messageModule} = require('../schemas/message.schema');
const user = require('../models/login.model');

class message {
    socket;

    static userInfo;

    static connect (req, res) {
        message.userInfo = user.getInfo(req, res);

        io.on('connect', (socket) => new message(socket, req, res));

        return message.userInfo;
    }

    constructor (socket) { 
        this.socket = socket;

        this.save();
        this.getHistory();

        socket.on('disconnect', function() { 
            io.sockets.emit('disconnect');
        });
        
        return;
    }

    getHistory () {
        this.socket.on(message.userInfo.userId, (info) => {
            if (info.type === "history") {
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
                    
                    this.socket.emit(message.userInfo.userId, messages);
                })();
            }
        });
    }

    save () { 
         
        this.socket.on(message.userInfo.userId, (info) => {
        
            if (info.type === "save") {
                messageModule({
                    fromUserId: info.from,
                    toUserId: info.to, 
                    message: info.mess
                }).save();

                io.sockets.emit('broadcast', {
                    fromUserId: info.from,
                    toUserId: info.to, 
                    message: info.mess
                });
            }
        }); 
    }
}

module.exports = (req, res) => message.connect(req, res);