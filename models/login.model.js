const {user} = require('../schemas/user.schema');
const jwt = require('jsonwebtoken');
const passwordHase = require('password-hash');

class loginModel {
    userId = null;

    constructor(email, password, req, res) {
        if (email === null || password === null) new Error('Empty user info passed.');

        return (async () => {
            if (await this.testIncomingInfo(email, password, req)) {
                this.setToken({email, userId : this.userId}, res);
            } else {
                res.redirect('/login');
            }
        })();
    }

    testIncomingInfo (email=null, password=null, req=null) {
        return (async () => {

            let errors = [];
            if (email.trim() === '') {
                errors.push({'email' : 'Email is required'});
            }

            if (password.trim() === '') {
                errors.push({'password' : 'Password is required'})
            }

            if (errors.length !== 0) {
                req.flash('errors', errors);
                return false;
            }

            let userInfo = await user.findOne({email});

            if (userInfo === null) {
                req.flash('errors', {'general' : 'Password Or Email Incorrect'});
        
                return false;
            };

            this.userId = userInfo.id;
            return passwordHase.verify(password, userInfo.password);
        })();
    }

    setToken (email=null, res={}) {
        const token = jwt.sign({email, userId: this.userId}, 'user');
        res.cookie('token', token).redirect('/dashboard');
    }

    static getInfo (req, res) { 
        const token = req.cookies.token || '';

        if (token === "") return res.redirect('/login');
        
        try {
            return jwt.verify(token, global.config.userTokenName);
        } catch {
            res.redirect(301, '/login');
        }

        return jwt.verify(token, global.config.userTokenName);
    }
}

module.exports = loginModel;

