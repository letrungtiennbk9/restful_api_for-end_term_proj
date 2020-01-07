let mongoose = require('mongoose');
let uri = 'mongodb+srv://letrungtiennbk9:Trungtienle9@cluster0-hjpbg.mongodb.net/shopping?retryWrites=true&w=majority';
mongoose.connect(uri, (err) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Connect succesfully');
  }
});


let Schema = mongoose.Schema
let schema = new Schema();
let order = mongoose.model('Order', schema, 'orders');
module.exports = order;