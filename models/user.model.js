const {user} = require('../schemas/user.schema');

class userModel {
    getList () {
        return user.find();
    }

    getUserId (email) {
        return user.find({email});
    }
}

module.exports = new userModel();
