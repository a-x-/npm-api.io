var express = require('express');
var app = express();
var npm = new require('npm-api')();
var help = require('fs').readFileSync('index.html', { encoding: 'utf-8' });

console.log('help', help);

app.get('/', function (req, res) {
    res.send(help)
});

app.get('/p/:package', function (req, res) {
    getPackageUrl(req.params.package)
    .then(function(url) { res.send(url); })
    .catch(function(err) { res.status(500).send(err); });
});

app.get('/go/:package', function (req, res) {
    getPackageUrl(req.params.package)
    .then(function(url) { res.redirect(url); })
    .catch(function(err) { res.status(500).send(err); });
});

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port ' + process.env.PORT);
});

function getPackageUrl(name) {
    var repo = npm.repo(name);
    return repo.package()
    .then(function(pkg) {
        var hostpath = pkg.repository.url
        .replace(/^.+\/\//, '')
        .replace(/^.+@/g, '')
        .replace(/\.git$/, '');

        return 'https://' + hostpath;
    });
}
