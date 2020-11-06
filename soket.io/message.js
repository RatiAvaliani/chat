const {message: messageModule} = require('../schemas/message.schema');
const user = require('../models/login.model');

class message {
    socket;

    static userInfo;

    static connect (req, res) {
        message.userInfo = user.getInfo(req, res);

        global.io.on('connect', (socket) => new message(req, res));

        return message.userInfo;
    }

    constructor (socket) { 
        this.socket = socket;
        console.log('User Connected.');

        this.save();
        this.getHistory();
        
        return;
    }

    getHistory () {
        this.socket.on('history', (info) => {
            console.log(info);
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
            });
    }

    save () { 
        this.socket.on('save', (info) => {
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
        }); 
    }
}

module.exports = (req, res) => message.connect(req, res);