const express = require('express');
const {connectToDb, getDb} = require('./db');
const PORT = 3000;
const ObjectId = require('mongodb').ObjectId

const app = express();
app.use(express.json());

let db;

connectToDb((err) =>{
    if(!err) {
        app.listen(PORT, (err) => {
            err ? console.log(err): console.log(`Listen port ${PORT}`);
        });
        db = getDb();
    } else {
        console.log(`DB connection error: ${err}`);
    }
});

const hadleError = (res, error) => {
    res.status(500).json({error});
}

app.get('/movie', (req, res) =>{
    const movie = [];

    db
        .collection('movie')
        .find()
        .sort({title: 1})
        .forEach((m) => movie.push(m))
        .then(() => {
            res
                .status(200)
                .json(movie);
        })
        .catch(() => hadleError(res, "Something goes wrong..."));
});

app.get('/movie/:id', (req, res) =>{
    if(ObjectId.isValid(req.params.id)){
        db
        .collection('movie')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then((doc) => {
            res
                .status(200)
                .json(doc);
        })
        .catch(() => hadleError(res, "Something goes wrong..."));
    } else {
        hadleError(res, "Wrong id");
    }
});

app.delete('/movie/:id', (req, res) =>{
    if(ObjectId.isValid(req.params.id)){
        db
        .collection('movie')
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch(() => hadleError(res, "Something goes wrong..."));
    } else {
        hadleError(res, "Wrong id");
    }
});

app.post('/movie', (req, res) =>{
    db
    .collection('movie')
    .insertOne(req.body)
    .then((result) => {
        res
            .status(201)
            .json(result);
    })
    .catch(() => hadleError(res, "Something goes wrong..."));
});

app.patch('/movie/:id', (req, res) =>{
    if(ObjectId.isValid(req.params.id)){
        db
        .collection('movie')
        .updateOne({ _id: new ObjectId(req.params.id) }, {$set: req.body})
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch(() => hadleError(res, "Something goes wrong..."));
    } else {
        hadleError(res, "Wrong id");
    }
});