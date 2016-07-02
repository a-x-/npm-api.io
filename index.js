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
    getPackageUrl(req.params.package, function(url) { res.send(url); })
    .catch(function(err) { res.status(500).send(err); });
});

app.get('/go/:package', function (req, res) {
    getPackageUrl(req.params.package, function(url) { res.redirect(url); })
    .catch(function(err) { res.status(500).send(err); });
});

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port ' + process.env.PORT);
});

function getPackageUrl(name, cb) {
    var repo = npm.repo(name);

    var promise = repo.package()
    .then(function(pkg) {
        var hostpath = pkg.repository.url
        .replace(/^.+\/\//, '')
        .replace(/^.+@/g, '')
        .replace(/:/, '/')
        .replace(/\.git$/, '');
        var url = 'https://' + hostpath;

        cb(url);
        return url;
    });
    
    writeLogDb(name);
    return promise;
}

function writeLogDb(name) {
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) console.log('mongo err', err);
        if (!db) return;
        var collection = db.collection('heroku_rc00k60z');
        collection.insertOne({"package": name}, function(err, result) {
            // console.log('insert', err, result);
            // collection.find({}).toArray(function(err, docs) {
            //     console.log('wtf', docs);
            //     db.close();
            // });
            db.close();
        });
    });
}