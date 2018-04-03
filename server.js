var express = require("express");
var app = express();
var jade = require('jade');
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var userLogedOut = require("./routes/userLogedOut");
var userLogedIn = require("./routes/userLogedIn");
var adminLogedIn = require("./routes/adminLogedIn");
var admin = require('./models/admin.model');
var user = require('./models/users.model');
var port = 80;
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/fashionDB");

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to mongodb");
    // we"re connected!
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.set('view options', {
    layout: false
});
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, "/views")));

// view engine setup
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'jade');

app.use('/',userLogedOut);
app.use('/',userLogedIn);
app.use('/',adminLogedIn);

app.use(function (req, res, next) {
    if (req.session && req.session.user) {
        user.findOne({
            email: req.session.user.email
        }, function (err, user) {
            if (user) {
                req.user = user;
                delete req.user.password;       // delete the password from the session
                req.session.user = user;        //refresh the session value
                res.locals.user = user;
            }
            // finishing processing the middleware and run the route
            next();
        });
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    if (req.session && req.session.admin) {
        admin.findOne({
            adminName: req.session.adminName
        }, function (err, admin) {
            if (admin) {
                req.admin = admin;
                delete req.adminPassword;       
                req.session.admin = admin;        
                res.locals.admin = admin;
            }
            next();
        });
    } else {
        next();
    }
});

app.listen(port);
console.log("Server is running on port " + port);