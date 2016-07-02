var express = require('express');
var app = express();
var npm = new require('npm-api')();

var fs = require('fs');
var read = function(name) {return fs.readFileSync(name, { encoding: 'utf-8' })};
var help = read('index.html');

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = process.env.MONGODB_URI;

app.use(express.static('.'));

app.get('/', function (req, res) {
    res.send(help)
});

app.get('/p/:package', function (req, res) {
    var package = req.params.package;
    getPackageUrl(package)
    .then(function(url) { res.end(url); })
    .then(function() { writeLogDb(package); })
    .catch(function(err) { res.status(500).end('error: package not found or server broken: ' + err); });
});

app.get('/go/:package', function (req, res) {
    var package = req.params.package;
    getPackageUrl(package)
    .then(function(url) { res.redirect(url); })
    .then(function() { writeLogDb(package); })
    .catch(function(err) { res.status(500).end('error: package not found or server broken: ' + err); });
});

app.get('/logs', function(req, res) {
    readLogsDb()
    .then(function(docs) {res.send(docs)})
    .catch(function(err) { res.status(500).end('error: server broken: ' + err); });
});

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port ' + process.env.PORT);
});

function getPackageUrl(name, cb) {
    var repo = npm.repo(name);

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

function writeLogDb(name) {
    console.log('> log', name);
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) console.log('mongo err', err);
        if (!db) return;
        var collection = db.collection('heroku_rc00k60z');
        collection.insertOne({"package": name}, function(err, result) {
            db.close();
        });
    });
}

function readLogsDb() {
    return new Promise(function(res, rej) {
        MongoClient.connect(mongoUrl, function(err, db) {
            if (err) rej(err);
            if (!db) return;
            var collection = db.collection('heroku_rc00k60z');
            collection.find({}).toArray(function(err, docs) {
                res(docs);
                db.close();
            });
        });
    });
}