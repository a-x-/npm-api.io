var express = require('express');
var app = express();
var npm = new require('npm-api')();
var fs = require('fs');
var read = function(name) {return fs.readFileSync(name, { encoding: 'utf-8' })};
var help = read('index.html');

/*var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;
MongoClient.connect(url, function(err, db) {
  // Use the admin database for the operation
  var adminDb = db.admin();
  // List all the available databases
  adminDb.listDatabases(function(err, dbs) {
    console.log('dbs.databases ' , dbs.databases);
    db.close();
  });
});*/

app.use(express.static('.'));

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

    writeDB('packages.log');

    return repo.package()
    .then(function(pkg) {
        var hostpath = pkg.repository.url
        .replace(/^.+\/\//, '')
        .replace(/^.+@/g, '')
        .replace(/:/, '/')
        .replace(/\.git$/, '');

        return 'https://' + hostpath;
    });
}

