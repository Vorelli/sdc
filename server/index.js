require("dotenv").config();
const app = require("./server");

const port = process.env.PORT || 3000;

app.listen(port, "192.168.0.200", (err) => {
  if (err) {
    console.log("err occurred when trying to listen", err);
  } else {
    console.log("server listening at port " + port);
  }
});
