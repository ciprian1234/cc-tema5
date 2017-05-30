const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/config');


/* CREATE APP */
const app = express();


/* CONNECT TO MONGO_DB */
mongoose.Promise = global.Promise;
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
  console.log("Connected to MongoDB:%s", config.database);
});
mongoose.connection.on('error', (err) => {
  console.log("MongoDB:%s CONNECTION FAILED!", config.database);
  console.log(err);
});


/* SET APP */
const port = process.env.PORT || 3000;
//get routes
const usersRouter = require('./routes/users');


/* USE MIDDLEWARE */
//set static folder
app.use(express.static( path.join(__dirname, 'public')));

// use cors
app.use(cors());

//use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//use passport MIDDLEWARE

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); //use passport JWT stragety

//use routers
app.use('/users', usersRouter);

//default route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'public/index.html'));
});


/* START SERVER */
const server = app.listen(port, () => {
  const host = server.address().address;
	const port = server.address().port;
	console.log("Web app listening at http://%s:%s", host, port);
});
