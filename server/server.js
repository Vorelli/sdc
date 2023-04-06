const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
var compression = require("compression");
const productsHandler = require("./handlers/products");
const questionsHandler = require("./handlers/questions");
const ratingsHandler = require("./handlers/ratings");
const cass = require("cassandra-driver");
const cors = require("cors");

const client = new cass.Client({
  contactPoints: ["localhost", "172.20.0.13:9042", "172.20.0.2:9042"],
  localDataCenter: "datacenter1",
  pooling: {
    coreConnectionsPerHost: {
      distance: {
        local: 2,
        remote: 1,
      },
    },
    maxRequestsPerConnection: 32768,
  },
  encoding: {
    map: Map,
    set: Set,
  },
});

const app = express();
const allowlist = [
  "http://localhost:3000",
  "http://72.112.222.190:3000",
  undefined,
];

var corsOptions = function (req, callback) {
  var corsOps = {
    origin: true, //allowlist.includes(req.header("Origin")),
  };
  // db.loadOrigins is an example call to load
  // a list of origins from a backing database
  callback(null, corsOps);
};

app.use((req, res, next) => {
  res.locals.db = client;
  next();
});
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    return false;
  }
  return compression.filter(req, res);
}

app.use(express.static(path.join(__dirname, "../public")));

app.use("/products", productsHandler);
app.use("/answers", questionsHandler);
app.use("/reviews", ratingsHandler);

module.exports = app;
