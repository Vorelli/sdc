const { uploadFiles } = require("../helpers/cloudinary");
const axios = require("axios");

const postAnswer = async (req, res, next) => {
  const token = process.env.API_KEY;
  const headers = {
    Authorization: token,
  };

  let id = req.body.questionId;
  try {
    const photoUrls = await uploadFiles(req.files);
    let newBody = {};
    Object.keys(req.body).forEach((key) => {
      console.log(key, req.body[key]);
      newBody[key] = JSON.parse(req.body[key]);
    });
    delete newBody.questionId;
    newBody.photos = photoUrls;
    console.log("NEWBODY", newBody);
    // const response = await apiPostRequest(`/questions/${id}/answers`, newBody)
    const response = await axios.post(
      `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/questions/${id}/answers`,
      newBody,
      { headers }
    );
    if (response.data === "Created") {
      await res
        .status(201)
        .json({ message: "Successfully created.", photos: newBody.photos });
    } else {
      throw new Error("Failed to upload photo to api.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error has been encountered", err });
  }
};

module.exports = { postAnswer };
