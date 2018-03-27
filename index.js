const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();

// Corey
var tasks = require('./routes/tasks');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/");
var taskSchema = new mongoose.Schema({
 desc: String,
 time: Number,
 comp: Boolean
});
var Task = mongoose.model("Task", taskSchema);
//


express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))

  // Corey
  .get('/tasks', (req, res) => res.render('pages/tasks'))
  .post("/addtask", function (req, res)  {
  if (req.body.desc &&
    req.body.time) {
    var taskData = {
      desc: req.body.desc,
      time: req.body.time,
      comp: Boolean(req.body.comp)
    }
    //insert data into the db
    Task.create(taskData, function (err, tasks) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/tasks');
      }
    });
  }
  })
  //
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
