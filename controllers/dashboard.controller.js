/* Adding message soket  */
const message = require('../soket.io/message');
const user = require('../models/user.model');
const crypto = require('crypto');
const random = require('random');

class dashboardController {
    init (req, res) { 
        (async () => {
            let users = await user.getList();
            let randomNum = random.int(10000, 99999);
            let token = `${randomNum}${Date.now()}`;
            let userInfo = message(req, res, token);

            res.render('dashboard', {users: users, userId: userInfo.userId, token: token});
        })();
    }
}

module.exports = new dashboardController();