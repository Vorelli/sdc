CREATE TYPE feature (
  feature text,
  value text
);

CREATE TYPE sku (
  id bigint,
  quantity bigint,
  size text
);

CREATE TYPE photo (
  thumbnail_url text,
  url text
);

CREATE TABLE products (
  id bigint,
  name text,
  slogan text,
  description text,
  category text,
  default_price double,
  features frozen<list<feature>>,
  PRIMARY KEY(id)
);

CREATE TABLE styles_by_product_id (
  product_id bigint,
  id bigint,
  name text,
  original_price double,
  sale_price double,
  default boolean,
  photos list<frozen<photo>>,
  skus list<frozen<sku>>,
  PRIMARY KEY(product_id)
);

CREATE TABLE related_by_product_id (
  product_id bigint,
  related set<bigint>,
  PRIMARY KEY(product_id)
);

CREATE KEYSPACE [IF NOT EXISTS] sdc
  WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 1 };

