var express = require('express');
var app = express();

var npm = new require('npm-api')();
var repo = npm.repo('gulp')

app.get('/', function (req, res) {
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

