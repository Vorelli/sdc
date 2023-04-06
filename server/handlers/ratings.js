const router = require("express").Router();
const { postReview } = require("../controllers/ratings.js");
const multer = require("multer");
const upload = multer();

router.post("/", upload.array("photos", 5), postReview);

module.exports = router;
