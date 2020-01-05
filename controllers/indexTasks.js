let indexTaskes = {};
const Product = require('../models/product');
const check = require('express-validator');
var { validationResult } = require('express-validator');
let multer = require("multer");
const IMAGE_PATH = './public/images/product';

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
    console.log(tmp);
    condition.title = {$regex : new RegExp(tmp, "i")};
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
  next();
}

indexTaskes.checkIfFileExists = (req, res, next) => {
  if (req.file == undefined) {
    res.status(422).json({ errors: [{ msg: 'File doesnt exist', param: 'productImage' }] });
    return;
  }
  next();
}

indexTaskes.updateItem = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  Product.updateById(req.params.id, req, (err, raw) => {
    if(err) {
      return res.status(500).json({message: 'Update failed'});
    }
    else {
      res.sendStatus(200);
    }
  });
}

indexTaskes.deleteItem = (req, res, next) => {
  Product.deleteById(req.params.id, (err) => {
    if(err) {
      return res.status(500).json({message: 'Delete failed'});
    }
    else {
      return res.status(200).json({message: 'Delete successfully'});
    }
  })
}

// indexTaskes.getRelatedProducts = (req, res, next) => {
//   Product.find()
// }

module.exports = indexTaskes;