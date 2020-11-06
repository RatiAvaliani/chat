const loginModel = require('./../models/login.model');

class loginController {
    init (req, res) { 
        res.render('login', {'errors' : req.flash('errors')[0]});
    }

    post (req, res) {
        let incomingBody = req.body;

        new loginModel(incomingBody.email, incomingBody.password, req, res);
    }

    logout (req, res) {
        try {
            res.cookie('token', '').redirect('/');
        } catch (e) {
            req.cookie('token', '').redirect('/');
        }
    }
}

module.exports = new loginController();