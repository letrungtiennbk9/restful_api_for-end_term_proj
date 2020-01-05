var express = require('express');
var router = express.Router();
const indexTasks = require('../controllers/indexTasks');

router.get('/:nTurn/:sortType', indexTasks.getOnDemand);
router.get('/', indexTasks.getByDefault);
router.post('/', indexTasks.trustedHeader, indexTasks.upload,
  indexTasks.checkIfFileExists, indexTasks.validators, indexTasks.post
);
router.put('/:id', indexTasks.updateValidators, indexTasks.updateItem);
router.delete('/:id', indexTasks.deleteItem);
// router.get('/relatedProducts', indexTasks.getRelatedProducts);
module.exports = router;