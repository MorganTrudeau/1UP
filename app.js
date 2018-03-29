const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'build')))
  .set('build', path.join(__dirname, 'build'))
  .get('/', (req, res) => res.render('app'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))