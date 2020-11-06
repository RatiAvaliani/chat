/* Adding message soket  */
const message = require('../soket.io/message');
const user = require('../models/user.model');

class dashboardController {
    init (req, res) {
        let userInfo = message(req, res, global.io);
        
        (async () => {
            let users = await user.getList();
            res.render('dashboard', {users: users, userId: userInfo.userId});
        })();
    }
}

module.exports = new dashboardController();