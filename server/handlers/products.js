const router = require("express").Router();
const {
  getProduct,
  getStyles,
  getRelated,
} = require("../controllers/products.js");

function processProductId(req, res, next) {
  const productId = req.params.productId;
  var num = undefined;
  if (!!productId && productId.length > 0) {
    num = parseInt(productId);
  } else {
    res.sendStatus(404);
  }

  if (Number.isNaN(num)) {
    res.sendStatus(404);
  } else {
    req.productId = num;
    next();
  }
}

router.get("/:productId", processProductId, getProduct);
router.get("/:productId/styles", processProductId, getStyles);
router.get("/:productId/related", processProductId, getRelated);

module.exports = router;
