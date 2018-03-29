const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const isDevelopment  = app.get('env') !== "production";

express()
  .use(express.static(path.join(__dirname, 'app')))
  .set('build', path.join(__dirname, 'build'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))