var express = require('express');
var router = express.Router();
const indexTasks = require('../controllers/indexTasks');

router.get('/:nTurn/:sortType', indexTasks.getOnDemand);
router.get('/', indexTasks.getByDefault);
router.get('/topTen', indexTasks.trustedHeader ,indexTasks.getTopTen);
router.post('/', indexTasks.trustedHeader, indexTasks.upload,
  indexTasks.checkIfFileExists, indexTasks.validators, indexTasks.post
);
router.post('/modify',indexTasks.trustedHeader, indexTasks.upload, indexTasks.updateValidators, indexTasks.updateItem);
router.post('/delete',indexTasks.trustedHeader ,indexTasks.upload,indexTasks.deleteItem);
router.get('/relatedProducts', indexTasks.getRelatedProducts);
router.get('/orders', indexTasks.trustedHeader ,indexTasks.getOrders);
module.exports = router;