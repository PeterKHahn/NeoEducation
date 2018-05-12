var express = require('express')

var app = express()

app.listen(3001, function() {
    console.log("listening on 3001")
})

app.get('/', function(req, res) {
    res.send('just a slash')
})

app.get('/app', (req, res) => {
    res.send('apps!')
})