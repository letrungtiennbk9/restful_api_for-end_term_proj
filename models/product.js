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
let schema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  typeProduct: { type: String, required: true },
  brand: { type: String, required: true },
  color: { type: String, required: true },
  imagePath: { type: String },
});

let products = mongoose.model('Product', schema, 'products');
module.exports = products;

module.exports.insertItem = (data, callback) => {
  products.insertMany(data, callback);
}

module.exports.searchItemOnDemand = (condition, callback, sortCond, limit) => {
  products.find(condition, callback)
    .sort(sortCond)
    .limit(limit);
}

module.exports.updateById = async (itemId, request, callback) => {
  let currentItem;

  await
  products.find({ _id: mongoose.Types.ObjectId(itemId) }, (err, docs) => {
    if(err) throw err;
    else {
      currentItem = docs[0];
    }
  });
  
  let setCond = {};
  setCond.title= request.body.title == undefined ? currentItem.title : request.body.title;
  setCond.price= request.body.price == undefined ? currentItem.price : request.body.price;
  setCond.typeProduct= request.body.typeProduct == undefined ? currentItem.typeProduct : request.body.typeProduct;
  setCond.brand= request.body.brand == undefined ? currentItem.brand : request.body.brand;
  setCond.color= request.body.color == undefined ? currentItem.color : request.body.color;
  setCond.imagePath= request.body.imagePath == undefined ? currentItem.imagePath : request.body.imagePath;

  products.updateMany({ _id: mongoose.Types.ObjectId(itemId) }, { $set: setCond }, callback);
}

module.exports.deleteById = (itemId, callback) => {
  products.deleteMany({_id: mongoose.Types.ObjectId(itemId)}, callback);
}
