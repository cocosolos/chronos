const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();

// Corey
var tasks = require('./routes/tasks');
var bodyParser = require('body-parser'); // required to parse data from a view
var mongoose = require("mongoose"); // mongodb framework
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://user:pass@ds125489.mlab.com:25489/heroku_shdsmcw3"); // personal login removed
var taskSchema = new mongoose.Schema({ // defines the object to insert in db
 desc: String,
 time: Number,
 comp: Boolean
});
var Task = mongoose.model("Task", taskSchema); // create an object using the schema

// Andrew
// schema for user created
var userReg = require('./routes/register');
var userSchema = new mongoose.Schema({
	username: {
		unique: true,
		type: String,
		trim: true
	},
	email: {
		unique: true,
		type: String,
		trim: true
	},
	pw: {
		type: String,
		trim: true
	}
});

// model called 'users' to be added to db
var User = mongoose.model('users', userSchema);

//


express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))

  // Corey
  // handle requests to and from the tasks page
  .get('/tasks', (req, res) => res.render('pages/tasks')) // requests to view
  .post("/addtask", function (req, res)  { // addtask post from view
  if (req.body.desc &&
    req.body.time) {
    var taskData = { // create taskData object with data from post
      desc: req.body.desc,
      time: req.body.time,
      comp: Boolean(req.body.comp)
    }
    // insert data into the db
    Task.create(taskData, function (err, tasks) { // add the data from taskData to the tasks collection in db
      if (err) {
        return next(err)
      } else {
        return res.redirect('/'); // redirect to index view on success
      }
    });
  }
  })


	// Andrew
	// register users
	.get('/register', (req, res) => res.render('pages/register'))
	.post("/adduser", function (req, res) {
	if (req.body.email &&
	req.body.username &&
	req.body.pw) {
		// create newUser to be added to database
		var newUser = {
			username: req.body.username,
			email: req.body.email,
			pw: req.body.pw
		};

		User.create(newUser, function(er, users) {
			if(er) {
				return next(er)
			} else {
				// return to index on success
				return res.redirect('/');
			}
		});
	}
	else {
		console.log(req.body.email);
		console.log(req.body.username);
		console.log(req.body.pw);
	}
  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
