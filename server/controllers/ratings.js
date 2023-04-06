const { uploadFiles } = require("../helpers/cloudinary");
const { apiPostRequest } = require("../../src/helpers/api");

const postReview = async (req, res, next) => {
  console.log("here in postReview");
  try {
    let newBody = {};
    Object.keys(req.body).forEach((key) => {
      newBody[key] = JSON.parse(req.body[key]);
    });
    console.log("newbody", newBody);
    if (req.files) newBody.photos = await uploadFiles(req.files);
    console.log("photos uploaded");
    const response = await apiPostRequest("/reviews", newBody);
    if (response.data === "Created") {
      await res.status(201).json({ message: "Successfully created." });
    } else {
      throw new Error("Failed to upload to api.");
    }
  } catch (err) {
    res.status(500).json({ message: "An error was encountered", err });
  }
};

module.exports = { postReview };
