var express = require('express');
var app = express();

//config web app
app.set('view engine', 'ejs');
app.set('views', __dirname+'/public');


//Use middleware
app.use(express.static('public'));


var server = app.listen(process.env.PORT || 80, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Web app listening at http://%s:%s", host, port);
});

app.get('/', function(req, res){
	res.render('index');
	console.log("<Client arrived>}}}");
});
