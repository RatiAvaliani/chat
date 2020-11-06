const mongoose = require('mongoose');
const schema = mongoose.Schema;

module.exports = {
    "message" : mongoose.model('message', new schema({
        fromUserId: {
            type: String
        },
        toUserId: {
            type: String
        },
        message: {
            type: String
        },
        seen: Boolean
    }))
}