const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const express = require('express');
const bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());
let uri = 'mongodb+srv://letrungtiennbk9:Trungtienle9@cluster0-hjpbg.mongodb.net/ass1?retryWrites=true&w=majority';
// let uri = 'mongodb://localhost:27017';
MongoClient.connect(uri, (err, result) => {
  if(err){
    console.log('err connecting to db' + err.message);
  }
  else{
    console.log('connect successfully');
    const collection = result.db('ass1').collection('collection1');

    app.delete('/products/:id', (req, res) => {
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

    app.put('/products/:id', (req, res) => {
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

    app.post('/products', (req, res) => {
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

    app.get('/products', (req, res) => {
      collection.find().toArray((err, result) => {
        res.header("Access-Control-Allow-Origin", "true");
        res.send(result);
        return;
      });
    });
  }


  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// app.listen(3000);
