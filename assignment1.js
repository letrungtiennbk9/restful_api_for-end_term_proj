const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const express = require('express');
const bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());
let uri = 'mongodb://localhost:27017/';
MongoClient.connect(uri, {autoIndex: false} ,(err, result) => {
  if(err){
    console.log('err connecting to db' + err.message);
  }
  else{
    console.log('connect successfully');
    const collection = result.db('ass1').collection('collection1');

    app.delete('/accounts/:id', (req, res) => {
      collection.deleteOne({_id: mongodb.ObjectID(req.params.id)}, (err, result) => {
        if(!err){
          console.log('Update successfully');
          res.sendStatus(200);
        }
        else{
          console.log('update failed ' + err.message);
        }
      });
    });

    app.put('/accounts/:id', (req, res) => {
      collection.updateOne({_id: mongodb.ObjectID(req.params.id)}, {$set: {name: req.body.name}}, (err, result) => {
        if(!err){
          console.log('Update successfully');
          res.sendStatus(200);
        }
        else{
          console.log('update failed ' + err.message);
        }
      });
    });

    app.post('/accounts', (req, res) => {
      collection.insertOne(req.body, (err, result) => {
        if(!err){
          console.log(result);
          res.sendStatus(200);
        }
        else{
          console.log('err posting' + err.message);
        }
      });
    });

    app.get('/accounts', (req, res) => {
      collection.find().toArray((err, result) => {
        res.send(result);
        return;
      });
    });
  }
});

app.listen(3000);