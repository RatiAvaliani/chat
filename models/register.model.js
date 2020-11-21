const passwordHash = require('password-hash');
const {user} = require('../schemas/user.schema');

class registerModel {
    constructor(username=null, email=null, password=null, res={}, req={}) {
        if (username === null || email === null || password === null) new Error('Empty user info passed.');

        this.register(username, email, password, res, req);
    }

    register (username=null, email=null, password=null, res={}, req={}) {
 
        if (password.trim() === '' || password.length < 8) {
            password = password.trim();
        } else {
            password = passwordHash.generate(password);
        }

        try {
            user({
                username,
                email,
                password,
                contactList: {
                    "5fb94d9c19d1732c083607a5": {
                        "username": "Chat Bot"
                    }
                }
            }).save((err) => {
                if (err !== null) {
                    req.flash('errors', err.errors);
                    res.redirect('/register');
                } else {
                    req.flash('success', 'You have registered successfully');
                    res.redirect('/login');
                }
            }); 
        } catch {
            new Error('Something when wrong when registering.')
        }
    }
}

module.exports = registerModel;
