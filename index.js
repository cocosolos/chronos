const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var tasks = require('./routes/tasks');



express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/tasks', (req, res) => res.render('pages/tasks'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
