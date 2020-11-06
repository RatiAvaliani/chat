const registerModel = require('./../models/register.model');

class registerController {
    init (req, res) { 
        res.render('register', {'errors' : req.flash('errors')});
    }

    post (req, res) {
        let incomingBody = req.body;

        new registerModel(incomingBody.username, incomingBody.email, incomingBody.password, res, req);
    }
}

module.exports = new registerController();