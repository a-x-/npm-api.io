var express = require('express');
var app = express();

var npm = new require('npm-api')();

app.get('/', function (req, res) {
    res.send('<h1>Npm Api Service</h1><h2>Usage</h2><p><code>GET /:package</code> e.g. GET /gulp retreives github url')
});

app.get('/:package', function (req, res) {
    var repo = npm.repo(req.params.package);
    repo.package()
    .then(function(pkg) {
        res.send('https://'+pkg.repository.url.split('//')[1].replace(/\.git$/, ''));
    })
    .catch(function(err) {
        res.status(500).send(err);
    });
});

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port ' + process.env.PORT);
});

