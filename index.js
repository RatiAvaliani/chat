const express = require('express');
const server = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const http = require('http').createServer(server);
const socket = require('socket.io');
global.io = socket(http);

/* Adding config as a global variable  */
global.config = require('./config.json');

/* Controllers */
const login = require('./controllers/login.controller');
const register = require('./controllers/register.controller');
const dashboard = require('./controllers/dashboard.controller');
const home = require('./controllers/home.controller');

/* Middleware */
const loginMiddleware = require('./middleware/login.middeware');

/* Connecting to mongodb */
mongoose.connect('mongodb+srv://app:Taso2020@cluster0.lqpqj.mongodb.net/mess?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

/* Static pages */
server.use('/static', express.static('public'));

/* Setting middleware */
server.use(cookieParser());
server.use(bodyParser.urlencoded({extended: false}));
server.use(session(global.config.session));
server.use(flash());

/* Setting templating engine */
server.set('view engine', 'ejs');

/* All paths */
server.get('/', home.init);

server.get('/dashboard', loginMiddleware.loginTest, dashboard.init);

server.get('/logout', loginMiddleware.loginTest, login.logout);

server.get('/login', loginMiddleware.loggedIn, login.init);

server.post('/login', loginMiddleware.loggedIn, login.post);

server.get('/register', loginMiddleware.loggedIn, register.init);

server.post('/register', loginMiddleware.loggedIn, register.post);

http.listen(global.config.ports.DEV, () => {
    console.log('App is running');
});
