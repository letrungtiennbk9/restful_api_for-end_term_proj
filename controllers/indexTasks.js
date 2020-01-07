let indexTaskes = {};
const Product = require('../models/product');
const Order = require('../models/order');
const check = require('express-validator');
var { validationResult } = require('express-validator');
let multer = require("multer");
const apiUrl = 'https://still-plateau-02404.herokuapp.com/';
const IMAGE_PATH = apiUrl + 'images/product';
const IMAGE_PATH_2 = apiUrl + 'images/product/';
const mongoose = require('mongoose');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, IMAGE_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

let fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' ||
    file.mimetype == 'image/jpg') {
    cb(null, true);
  }
  else {
    cb(new Error('Định dạng file không hợp lệ'), false);
  }
}

indexTaskes.upload = multer({ storage: storage, fileFilter: fileFilter }).single('productImage');

indexTaskes.validators = [
  check.body('price').isFloat({ min: 0 }),
  check.body('title').isString().not().isEmpty(),
  check.body('color').isString().custom(value => {
    if (!(value == 'Đen' || value == 'Trắng' || value == 'Xanh da trời' || value == 'Vàng gold' || value == 'Hồng mạnh mẽ')) {
      throw new Error('Màu không hợp lệ, vui lòng chọn trong danh sách');
    }
    return true;
  }),
  check.body('brand').isString().custom(value => {
    if (!(value == 'Gucci' || value == 'H&M' || value == 'Pull&Bear' || value == 'Mango' || value == 'Routine')) {
      throw new Error('Nhãn hiệu không hợp lệ, vui lòng chọn trong danh sách');
    }
    return true;
  }),
  check.body('typeProduct').isString().custom(value => {
    if (!(value == 'Áo khoác' || value == 'Áo thun' || value == 'Áo lót' || value == 'Áo len' ||
      value == 'Áo sơ mi' || value == 'Quần thể thao' || value == 'Quần jogger' || value == 'Váy' ||
      value == 'Đầm' || value == 'Sneaker' || value == 'Giày cao gót')) {
      throw new Error('Nhãn hiệu không hợp lệ, vui lòng chọn trong danh sách');
    }
    return true;
  }),
  check.body('imagePath').optional().isString()
]

indexTaskes.updateValidators = [
  check.body('price', 'Giá không hợp lệ, vui lòng nhập số').optional().isFloat({ min: 0 }),
  check.body('title').optional().isString().not().isEmpty(),
  check.body('color').optional().isString().custom(value => {
    if (!(value == 'Đen' || value == 'Trắng' || value == 'Xanh da trời' || value == 'Vàng gold' || value == 'Hồng mạnh mẽ')) {
      throw new Error('Màu không hợp lệ, vui lòng chọn trong danh sách');
    }
    return true;
  }),
  check.body('brand').optional().isString().custom(value => {
    if (!(value == 'Gucci' || value == 'H&M' || value == 'Pull&Bear' || value == 'Mango' || value == 'Routine')) {
      throw new Error('Nhãn hiệu không hợp lệ, vui lòng chọn trong danh sách');
    }
    return true;
  }),
  check.body('typeProduct').optional().isString().custom(value => {
    if (!(value == 'Áo khoác' || value == 'Áo thun' || value == 'Áo lót' || value == 'Áo len' ||
      value == 'Áo sơ mi' || value == 'Quần thể thao' || value == 'Quần jogger' || value == 'Váy' ||
      value == 'Đầm' || value == 'Sneaker' || value == 'Giày cao gót')) {
      throw new Error('Nhãn hiệu không hợp lệ, vui lòng chọn trong danh sách');
    }
    return true;
  }),
  check.body('imagePath').optional().isString()
]

indexTaskes.post = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  else {
    req.body.imagePath = IMAGE_PATH + req.file.filename;
    Product.insertItem(req.body, (err, docs) => {
      if (err) {
        console.log("Error insert to database");
        console.log(err);
        res.status(500);
        res.send(err);
      }
      else {
        console.log("Insert successfully");
        console.log(docs);
        res.send("OK");
      }
    });
  }
}

indexTaskes.updateItem = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  req.body.imagePath = IMAGE_PATH_2 + req.file.filename;
  Product.updateById(req.body.id, req, (err, raw) => {
    if (err) {
      return res.status(500).json({ message: 'Update failed' });
    }
    else {
      console.log('Update successfully');
      res.sendStatus(200);
    }
  });
}

indexTaskes.getOnDemand = (req, res, next) => {
  let condition = {};
  let sortCond = {};
  if (req.params.sortType != undefined && req.params.sortType != "") {
    if (req.params.sortType == "priceAsc") {
      sortCond.price = 1;
    }
    if (req.params.sortType == "priceDsc") {
      sortCond.price = -1;
    }
  }
  if (req.query.type != undefined && req.query.type != "") {
    let val = req.query.type;
    let paramVals = [];
    if (val.includes(",")) {
      paramVals = val.split(",");
    }
    else {
      paramVals.push(val);
    }
    condition.typeProduct = { $in: paramVals };
  }
  if (req.query.brand != undefined && req.query.brand != "") {
    let val = req.query.brand;
    let paramVals = [];
    if (val.includes(",")) {
      paramVals = val.split(",");
    }
    else {
      paramVals.push(val);
    }
    condition.brand = { $in: paramVals };
  }
  if (req.query.color != undefined && req.query.color != "") {
    let val = req.query.color;
    let paramVals = [];
    if (val.includes(",")) {
      paramVals = val.split(",");
    }
    else {
      paramVals.push(val);
    }
    condition.color = { $in: paramVals };
  }
  if (req.query.title != undefined && req.query.title != "") {
    let tmp = req.query.title;
    condition.title = { $regex: new RegExp(tmp, "i") };
  }
  if (req.query.id != undefined && req.query.id != "") {
    condition._id = mongoose.Types.ObjectId(req.query.id);
  }
  if (req.query.price != undefined && req.query.price != "") {
    condition.price = { $lt: req.query.price };
  }

  Product.searchItemOnDemand(condition, (err, respond) => {
    if (err) {
      console.log("Error finding");
      console.log(err)
    }
    else {
      res.header("Access-Control-Allow-Origin", "*");
      res.send(respond);
    }
  }, sortCond, req.params.nTurn * 10 + 10);
}

indexTaskes.getByDefault = (req, res, next) => {
  Product.find((err, respond) => {
    if (err) {
      console.log("Error finding");
      console.log(err)
    }
    else {
      res.header("Access-Control-Allow-Origin", "*");
      res.send(respond);
    }
  });
}

indexTaskes.trustedHeader = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
}

indexTaskes.checkIfFileExists = (req, res, next) => {
  if (req.file == undefined) {
    res.status(422).json({ errors: [{ msg: 'File doesnt exist', param: 'productImage' }] });
    return;
  }
  next();
}

indexTaskes.deleteItem = (req, res, next) => {
  console.log(req.body);
  Product.deleteById(req.body.id, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Delete failed' });
    }
    else {
      return res.status(200).json({ message: 'Delete successfully' });
    }
  })
}

indexTaskes.getRelatedProducts = (req, res, next) => {
  Product.countAvailableDocs((err, result) => {
    if (err) { return res.status(500).json({ message: 'Error getting related products' }) }

    let arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(Math.floor(Math.random() * result));
    }

    let tmp = [];
    for (let i = 0; i < arr.length; i++) {
      Product.findOne({}, (err, docs) => {
        if (err) { return res.status(500).json({ message: 'Error getting related products' }) }

        tmp.push(docs);
        if(tmp.length == 5){
          res.status(200).json({result: tmp});
        }
      }).skip(arr[i]);
    }

  });
}

indexTaskes.getOrders = (req, res, next) => {
  Order.find({}, (err, rspnd) => {
    if(err){
      return res.status(500).json({message: 'Error getting orders'});
    }

    return res.status(200).json({result: rspnd});
  });
}

indexTaskes.getTopTen = (req, res, next) => {
  Product.find({}, (err, docs) => {
    if(err){res.status(500).json({message: 'Error getting top ten'})}
    return res.status(200).json(docs);
  }).limit(10).sort({sold:-1})
}

module.exports = indexTaskes;