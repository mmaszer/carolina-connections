const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
//const expressEjsLayout = require('express-ejs-layouts')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

require("./config/passport")(passport) // ??

var path = require('path');
app.use(express.static(path.join(__dirname, '/public')));

//mongoose
/*mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err));*/
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//EJS
app.set('view engine','ejs');
//app.use(expressEjsLayout);

//BodyParser
app.use(express.urlencoded({extended : false}));

app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
   }));
    app.use(passport.initialize());
    app.use(passport.session());
   //use flash
   app.use(flash());
   app.use((req,res,next)=> {
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error  = req.flash('error');
   next();
})

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


const port = process.env.PORT || 3030;
app.listen(port); 