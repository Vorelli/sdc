const router = require("express").Router();
const { postAnswer } = require("../controllers/questions.js");
const multer = require("multer");
const upload = multer();

router.post("/", upload.array("photos", 5), postAnswer);

module.exports = router;
