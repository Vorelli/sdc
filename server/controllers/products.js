const getProduct = (req, res) => {
  res.locals.db
    .execute("SELECT * FROM sdc.products WHERE id=?", [req.productId], {
      prepare: true,
    })
    .then((data) => {
      if (data.rows.length > 0) {
        res.status(200).json(data.rows[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.log("error ocurred when trying to fetch product from cass", err);
      res.sendStatus(500);
    });
  //res.locals.client.execute()
};

const getStyles = (req, res) => {
  res.locals.db
    .execute(
      "SELECT * FROM sdc.styles_by_product_id WHERE product_id=?",
      [req.productId],
      {
        prepare: true,
      }
    )
    .then((data) => {
      if (data.rows.length > 0) {
        res.status(200).json({ product_id: req.productId, results: data.rows });
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.log("error ocurred when trying to fetch product from cass", err);
      res.sendStatus(500);
    });
};

const getRelated = (req, res) => {
  res.locals.db
    .execute(
      "SELECT * FROM sdc.related_by_product_id WHERE product_id=?",
      [req.productId],
      {
        prepare: true,
      }
    )
    .then((data) => {
      console.log(data.rows);
      if (data.rows.length > 0) {
        res.status(200).json(Array.from(data.rows[0].related));
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.log("error ocurred when trying to fetch product from cass", err);
      res.sendStatus(500);
    });
};

module.exports = { getProduct, getStyles, getRelated };
