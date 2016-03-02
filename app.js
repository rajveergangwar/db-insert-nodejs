var http            = require('http');
var mysql           = require('mysql');
var express         = require('express');
var bodyParser      = require('body-parser');
var fs              = require('fs');
var S               = require('string');
var app             = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true}));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'htp@123',
  database : 'nodejs_demo'
});

connection.connect(function(err){
    if(!err){
        console.log("Connection Establised");
    } else {
        console.log(err);
    }
    
});

app.get('/regForm', function (req, res) {
    fs.readFile('register.html', {encoding: 'utf-8'}, function (err, data) {
        if (!err) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        } else {
            console.log(err);
        }
    });
});

app.post('/createUser', function (req, res) {
    var data        =   req.body;
    var username    =   data.username;
    var password    =   data.password;
    var address     =   data.address;
    var errors      =   [];
    if(username=="")
        errors.push("username.length.error");
    if(password=="")
        errors.push("password.length.error");
    if(address=="")
        errors.push("address.length.error");
    if(errors.length>0) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(errors));
        console.log(errors);
    } else {
        dbData  =   {
            'username'  :   username,
            'password'  :   password,
            'address'   :   address
        }
        var query   =   connection.query('insert into user_details set ?' , dbData , function(err,result) {
            if(err) {
                console.log(err);
                if(err.code=='ER_DUP_ENTRY') {
                    errors  =   "username.dublicate.found";
                    res.send(JSON.stringify(errors));
                    console.log(errors);
                }
            } else {
                console.log("insert perform successfully");
            }
        });
        //res.send(query.sql);
    }
})

app.listen('3001', function (req, res) {
    console.log("running on port 3001");
});
