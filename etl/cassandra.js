const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const cass = require("cassandra-driver");
const results = [];

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

function valuesFromProduct(product) {
  return [
    parseInt(product.id),
    product.name,
    product.slogan,
    product.description,
    product.category,
    parseFloat(product.default_price),
  ];
}

function readAndInsertProducts() {
  const query =
    "INSERT INTO sdc.products (id, name, slogan, description, category, default_price) VALUES (?, ?, ?, ?, ?, ?);";
  var num = 0;

  fs.createReadStream(path.join(__dirname, "./product.csv"))
    .pipe(csv())
    .on("data", (d) => {
      client.execute(query, valuesFromProduct(d), { prepared: true });
      num++;
    })
    .on("end", () => {
      console.log("finished processing products. Rows:", num);
      readAndInsertFeatures();
    });
}

function valuesFromFeature(feature) {
  return {
    feature: feature.feature,
    value: feature.value === "null" ? null : feature.value,
  };
}

function readAndInsertFeatures() {
  var features = [];
  var product_id = undefined;
  const query = `UPDATE sdc.products SET features=? WHERE id=?;`;
  var queries = [];
  var num = 0;

  async function send(queries) {
    // const queries = features.map((feature) => ({
    //   query: "UPDATE sdc.products SET features = features + ? WHERE id=?;",
    //   params: [[feature], product_id],
    // }));

    try {
      client.batch(queries, { prepare: true });
    } catch (err) {
      throw err;
    }
  }

  fs.createReadStream(path.join(__dirname, "./features.csv"))
    .pipe(csv())
    .on("data", (d) => {
      num++;
      if (features.length > 0 && product_id !== d.product_id) {
        queries.push({ query, params: [features, product_id] });
        if (queries.length > 100) {
          send(queries);
          queries = [];
        }
        features = [];
      }
      product_id = d.product_id;
      features.push(valuesFromFeature(d));
    })
    .on("end", async () => {
      console.log("finished processing features. Rows:", num);
      if (features.length > 0)
        queries.push({ query, params: [features, product_id] });
      if (queries.length > 0) send(queries);
      readAndInsertStyles();
    });
}

function valuesFromStyle(style) {
  return [
    parseInt(style.id),
    parseInt(style.productId),
    style.name,
    style.sale_price === "null" ? null : parseFloat(style.sale_price),
    parseFloat(style.original_price),
    style.default + "" === "1",
  ];
}

function readAndInsertStyles() {
  const query = `INSERT INTO sdc.styles_by_product_id
      (id, product_id, name, sale_price, original_price, default)
      VALUES (?, ?, ?, ?, ?, ?);`;
  var batchReqs = [];
  var num = 0;

  fs.createReadStream(path.join(__dirname, "./styles.csv"))
    .pipe(csv())
    .on("data", (d) => {
      num++;
      styleIdToProductId[d.id] = d.productId;
      batchReqs.push({ query, params: valuesFromStyle(d) });
      if (batchReqs.length > 100) {
        client.batch(batchReqs, { prepare: true });
        batchReqs = [];
      }
    })
    .on("end", () => {
      console.log("finished processing styles. Rows:", num);
      if (batchReqs.length > 0) {
        client.batch(batchReqs, { prepare: true });
        batchReqs = [];
      }
      readAndInsertSkus();
    });
}

function valuesFromSku(sku) {
  return {
    id: parseInt(sku.id),
    quantity: parseInt(sku.quantity),
    size: sku.size,
  };
}

function readAndInsertSkus() {
  var skus = [];
  var styleId = undefined;
  const query = `UPDATE sdc.styles_by_product_id SET skus=? WHERE product_id=?`;
  var queries = [];
  var num = 0;

  async function send(skus, styleId) {
    client.batch(queries, { prepare: true });

    /* const queries = skus.map((sku) => ({
      query:
        "UPDATE sdc.styles_by_product_id SET skus = skus + ? WHERE product_id=?;",
      params: [[sku], styleIdToProductId[styleId]],
    }));

    try {
      await client.batch(queries, { prepare: true });
    } catch (err) {
      throw err;
    } */
  }

  fs.createReadStream(path.join(__dirname, "./skus.csv"))
    .pipe(csv())
    .on("data", (d) => {
      num++;
      if (skus.length > 0 && d.styleId !== styleId) {
        queries.push({ query, params: [skus, styleIdToProductId[styleId]] });
        if (queries.length > 100) {
          send(queries);
          queries = [];
        }
        skus = [];
      }

      styleId = d.styleId;
      skus.push(valuesFromSku(d));
    })
    .on("end", async () => {
      console.log("finished processing skus. Rows:", num);
      if (skus.length > 0)
        queries.push({ query, params: [skus, styleIdToProductId[styleId]] });
      if (queries.length > 0) send(queries);
      readAndInsertPhotos();
    });
}

function valuesFromPhoto(photo) {
  return {
    url: photo.url,
    thumbnail_url: photo.thumbail_url,
  };
}

function readAndInsertPhotos() {
  var photos = [];
  var styleId = undefined;
  var queries = [];
  const query =
    "UPDATE sdc.styles_by_product_id SET photos = ? WHERE product_id=?;";
  var num = 0;

  async function send(queries) {
    // const queries = photos.map((photo) => ({
    //   query:
    //     "UPDATE sdc.styles_by_product_id SET photos = photos + ? WHERE product_id=?;",
    //   params: [[photo], styleIdToProductId[styleId]],
    // }));

    try {
      await client.batch(queries, { prepare: true });
    } catch (err) {
      throw err;
    }
  }

  fs.createReadStream(path.join(__dirname, "./photos.csv"))
    .pipe(csv())
    .on("data", (d) => {
      num++;
      if (photos.length > 0 && d.styleId !== styleId) {
        queries.push({ query, params: [photos, styleId] });
        if (queries.length > 5) {
          send(queries);
          queries = [];
        }
        photos = [];
      }

      styleId = d.styleId;
      photos.push(valuesFromPhoto(d));
    })
    .on("end", () => {
      console.log("finished processing photos. Rows:", num);
      if (photos > 0) queries.push({ query, params: [photos, styleId] });
      if (queries.length > 0) send(queries);
      readAndInsertRelated();
    });
}

function readAndInsertRelated() {
  var related = new Set();
  var productId = undefined;
  var queries = [];
  const query = `INSERT INTO sdc.related_by_product_id (product_id, related) VALUES (?, ?);`;
  var num = 0;

  var send = (queries) => {
    try {
      client.batch(queries, { prepare: true });
    } catch (err) {
      console.log("error encountered when trying to send related");
    }
  };

  fs.createReadStream(path.join(__dirname, "./related.csv"))
    .pipe(csv())
    .on("data", (d) => {
      num++;
      if (related.length > 0 && d.productId !== productId) {
        queries.push({ query, params: [productId, related] });
        if (queries.length > 100) {
          send(queries);
          queries = [];
        }
        related = new Set();
      }

      productId = d.current_product_id;
      related.add(related);
    })
    .on("end", () => {
      console.log("finished processing related. Rows:", num);
      if (related.length > 0) send(related, productId);
      const done = new Date();
      console.log("done in", done - start);
      console.log("start", start);
      console.log("done", done);
      client.shutdown();
    });
}

async function dropAndRecreateTables() {
  await client.execute("DROP KEYSPACE IF EXISTS sdc;");
  await client.execute(
    "CREATE KEYSPACE IF NOT EXISTS sdc WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 1 };"
  );
  await client.execute("USE sdc;");
  await client.execute("CREATE TYPE feature (feature text, value text);");
  await client.execute(
    "CREATE TYPE sku (id bigint, quantity bigint, size text);"
  );
  await client.execute("CREATE TYPE photo (thumbnail_url text, url text);");
  await client.execute(
    "CREATE TABLE products (id bigint, name text, slogan text, description text, category text, default_price double, features list<frozen<feature>>, PRIMARY KEY(id));"
  );
  await client.execute(
    "CREATE TABLE styles_by_product_id (product_id bigint, id bigint, name text, original_price double, sale_price double, default boolean, photos list<frozen<photo>>, skus list<frozen<sku>>, PRIMARY KEY(product_id));"
  );

  await client.execute(
    "CREATE TABLE related_by_product_id (product_id bigint, related set<bigint>, PRIMARY KEY(product_id));"
  );
}

let styleIdToProductId = {};
var start = new Date();
// readAndInsertFeatures();

dropAndRecreateTables().then(() => {
  console.log("insdie here");
  readAndInsertProducts();
});
