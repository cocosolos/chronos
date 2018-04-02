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
var userSchema = new mongoose.Schema({
	username: String,
	email: String,
	pw: String
});

// hash the password for each user before entered in the db
userSchema.pre('validate', function (next) {
	let user = this;		
	bcrypt.hash(user.pw, 10, function (err, hash){
		if (err) {
			return next(err);
		}
		user.pw = hash;
		next();
	})
});

// model called 'users' to be added to db
let User = mongoose.model('users', userSchema);

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
	.post("/addUser", function (req, res) {
	if (req.body.email &&
	req.body.username &&
	req.body.pw) {
		// create newUser to be added to database
		var newUser = new User({
			username: req.body.username,
			email: req.body.email,
			pw: req.body.pw
		});
		
		User.create(newUser, function(err, tasks) {
			if(err) {
				// reload register page if error
				return res.redirect('/register')
			} else {
				// return to index on success
				return res.redirect('/)
			}
		});
	}
  })
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
