// init
var express 	= require('express');
var session 	= require('express-session');
var bodyParser = require('body-parser');
var curl 		= require('curlrequest');
var app 		= express();

app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
// set up ejs for templating
app.set('view engine', 'ejs');


app.use(session({
  cookieName: 'session',
  secret: 'lakesaij123i1osap',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// variables
var page = "https://api-staging.socialidnow.com/v1/marketing/login/info?api_secret=";
var secret = "24979348df8f970ce19849ad861e215afa8a582f6e2f28f99b549da585e12bfb";
var middle = "&token=";
var fields = "&fields=birthday,gender,name,location";
// session
var sess;

// Home
app.get('/',function(req,res){
	sess = req.session;
	res.render('pages/index.ejs'); // load the index.ejs file
});

// Post login
app.post('/login', function(req, res) {
	sess = req.session;
	sess.token = req.body.token;

	res.send('done');
});

// Login page with info
app.get('/login', function(req, res) {
	sess = req.session;

	if (sess.token === "") {
		res.redirect('/')
	} else {
    	res.render('pages/logged.ejs'); // load the index.ejs file   
	}
});

app.get('/info', function(req,res) {
	sess = req.session;

	var options = { url: page+secret+middle+sess.token+fields, include: false };

	curl.request(options, function (err, parts) {
	    parts = parts.split('\r\n');
	    sess.info = JSON.parse(parts.pop());
		res.send(sess.info);
	});
});


// LOGOUT ==============================
app.post('/logout',function(req,res) {
	req.session.destroy(function(err) {
	  if(err) {
	    console.log(err);
	  } else {
	    res.redirect('/');
	  }
	})
});


// REDIRECT INVALID URL ================
app.use(function(req, res){
    res.redirect('/') // route every path to this
});


//  launch ==================================================
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
