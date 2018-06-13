const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();
var bodyParser = require('body-parser'); // required to parse data from a view
var mongoose = require("mongoose"); // mongodb framework
var bcrypt = require('bcrypt'); // for encrypting passwords
var session = require('express-session');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://user:pass@ds125489.mlab.com:25489/heroku_shdsmcw3");

// Corey
var taskSchema = new mongoose.Schema({ // defines the object to insert in db
  desc: String,
  time: Number,
  comp: Boolean,
  uid: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: User
  }
});
var Task = mongoose.model("Task", taskSchema); // create an object using the schema

// Andrew
// schema for user created
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

userSchema.pre('save', function(next) {
	var userToAdd = this;
	bcrypt.hash(userToAdd.pw, 10, function(err, hash) {
		if (err) {
			return next(err);
		}
		userToAdd.pw = hash;
		next();
	})
});

// define static method for userSchema to auth credentials
userSchema.statics.authenticate = function(em, passw, next) {
	User.findOne({email: em}).exec(function(err, users) {
		if (err) {
			//console.log("Error");
			return next(err);
		}
		// if user does not exist
		else if (!users) {

			var er = new Error('Username does not exist.');
			er.status = 401;

			//console.log("User dne");
			return next(er);
		}
		bcrypt.compare(passw, users.pw, function(err, result) {
			if (result === true) {
				//console.log("Success");
				return next(null, users);
			}
			else {
				return next();
			}
		})
	});
}

// model called 'users' to be added to db
var User = mongoose.model('users', userSchema);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(session({
	  secret: 'temp secret',
	  resave: true,
	  saveUninitialized: false
  }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
	  if (req.session.userId) {
      res.locals.loggedIn = true;
	  }
	  else {
      res.locals.loggedIn = false;
	  }
    res.render('pages/index')
  })
  .get('/tasks', (req, res) => {
	  if (req.session.userId) {
		  res.render('pages/tasks')
	  }
	  else {
		  res.render('pages/notloggedin')
	  }

  })
  .get('/register', (req, res) => res.render('pages/register'))
  .get('/login', (req, res) => {
	  if (req.session.userId) {
      res.render('pages/login')
	  }
	  else {
		  res.render('pages/login')
	  }
  })
  .get('/loginsuccess', (req, res) => res.render('pages/loginsuccess'))
  .get('/list', (req, res) => {
	// if logged in
	if(req.session.userId) {
	  Task.find( { uid: req.session.userId }, function(err, tasks) { // need to change this to search for UID
      if (err) return console.log(err);
      var compStack = [];
      var listStack = [];

      for(var i=0; i < tasks.length; i++) {
        if (tasks[i].comp == true){
          compStack.push(tasks[i]);
        } else{
          listStack.push(tasks[i]);
        }
      }
      res.render('pages/list', {compStack, listStack});
      });
	}
	else {
	  res.render('pages/notloggedin')
	}
  })
  .put('/tasks', (req, res) => {
  Task.findOneAndUpdate({_id: req.body.id}, {
    $set: {
      comp: !req.body.comp
    }
  }, (err, result) => {
    if (err) return res.send(err)
    return res.redirect('/list');
  })
})
.put('/comp', (req, res) => {
Task.findOneAndUpdate({_id: req.body.id}, {
  $set: {
    comp: true
  }
}, (err, result) => {
  if (err) return res.send(err)
})
})

  .delete('/tasks', (req, res) => {
    Task.deleteOne({ _id: req.body.id }, (err, result) => {
    if (err) {
      return next(err)
    } else {
      return res.redirect('/list');
    }
  })
})

  // Corey
  // handle requests to and from the tasks page
  .post("/addtask", function (req, res)  { // addtask post from view
  if (req.body.desc &&
    req.body.time) {
    var taskData = { // create taskData object with data from post
      desc: req.body.desc,
      time: req.body.time,
      comp: Boolean(req.body.comp),
	  uid: req.session.userId
    }
    // insert data into the db
    Task.create(taskData, function (err, tasks) { // add the data from taskData to the tasks collection in db
      if (err) {
        return next(err)
      } else {
        return res.redirect('/list'); // redirect to index view on success
      }
    });
  }
  })


	// Andrew
	// register users
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
				return res.redirect('/login');
			}
		});
	}
	else {
		console.log(req.body.email);
		console.log(req.body.username);
		console.log(req.body.pw);
	}
  })

	// Andrew
	// login
	.post("/trylogin", function (req, res) {
		User.authenticate(req.body.email, req.body.pw, function(err, users){
			if (err) {
				//console.log("Error in call");
				return res.redirect('/login');
			}
			else if (!users) {
				return res.redirect('/login');
			}
			else {
        res.locals.loggedIn = true;
				req.session.userId = users._id;
				return res.redirect('/loginsuccess');
			}
		});
	})

	.post("/logout", function (req, res) {
		if (req.session) {
			req.session.destroy(function(err) {
				if (err) {
					return next(err);
				}
				else {
					return res.redirect('/');
				}
			});
		}
	})

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
