// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    age: String
})
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'
// Use native promises
// mongoose.Promise = global.Promise;

// Routes
// Root Request
app.get('/', function(req, res) {
    User.find({}, function(err, users) {
        if(err) {
            console.log("could not retrieve data")
        } else {
            console.log("retrieved all data")
            var users = users;
            res.render('index', {users: users});   
            
        }
    })
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    
})
// Add User Request 
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    // This is where we would add the user from req.body to the database.
    // create a new User with the name and age corresponding to those from req.body
    // var user = new User({name: req.body.name, age: req.body.age});
    var user = new User(req.body);
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    user.save(function(err) {
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log("something went wrong");
        } else {
            console.log("successfully added a user");
            res.redirect('/');            
        }
    })
})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
