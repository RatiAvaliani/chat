const jwt = require('jsonwebtoken');

const loginTest = (req, res, next) => {
    const token = req.cookies.token || '';

    if (token === "") return res.redirect('/login');
    
    try {
        const verifiedToken = jwt.verify(token, global.config.userTokenName);
        if (verifiedToken) {
            return next();
        }

    } catch {
        res.redirect(301, '/login');
    }
}

const loggedIn = (req, res, next) => {
    const token = req.cookies.token || '';

    if (token === "") return next();

    try {
        const verifiedToken = jwt.verify(token, global.config.userTokenName);
        if (verifiedToken) res.redirect('/dashboard');

    } catch {
        res.redirect('/login');
    }
}

module.exports = {
    loginTest,
    loggedIn
};