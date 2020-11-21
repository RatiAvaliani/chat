const userModel = require('./../models/user.model');
const jwt = require('jsonwebtoken');

class userController {
    searchUsers (req, res) {
        (async () => {
            let userList = await userModel.searchUserByNames(req.body.username);
            res.json(userList);
        })();  
    }

    getContacts (req, res) {
        (async () => {
            let userInfo = jwt.decode(req.cookies.token);
            let contactList = await userModel.getContacts(userInfo.userId);
            res.json(contactList);
        })();
    }

    addContact (req, res) {
        (async () => {
            try {
                let userInfo = jwt.decode(req.cookies.token);
                let info = await userModel.addContact(userInfo.userId, req.body.userId, res);
                res.json(info);
            } catch (e) {
                res.json(new Error('There was a problem.'));
            }
            
        })();
    }
}

module.exports = new userController();