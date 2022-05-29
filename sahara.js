const e = require("express");
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/login", async (req, res) => {
  const mongo = await mongoose.connection;
  const users = mongo.db.collection("sahara_users");
  var user = req.body.user;
  var pass = req.body.pass;
  await users.find({ user: user, password: pass }, async (err, data) => {
    if (err) {
      res.send({});
    } else {
      var r = await data.toArray();
      if (r.length == 0) {
        res.send({});
      } else {
        res.send(r[0]);
      }
    }
  });
});

async function getUser(user) {
  const mongo = await mongoose.connection;
  const users = mongo.db.collection("sahara_users");
  await users.findOne({ user: user }, (err, data) => {
    if (err) {
      return {};
    } else {
      if (data == null) {
        return {};
      } else {
        return data;
      }
    }
  });
  return {};
}

async function getProduct(id) {
  const mongo = await mongoose.connection;
  const products = mongo.db.collection("sahara_products");
  var v = await products.findOne({ id: id });
  return v;
}

router.post("/signup", async (req, res) => {
  const mongo = await mongoose.connection;
  const users = mongo.db.collection("sahara_users");
  var user = `${req.body.user}`;
  var pass = `${req.body.pass}`;
  var name = `${req.body.name}`;
  if (user.length > 0 && pass.length > 0 && name.length > 0) {
    var result = await users.insertOne({
      user: user,
      password: pass,
      name: name,
    });
    res.send({ count: result.insertedCount });
  } else {
    res.send({ count: 0 });
  }
});

router.post("/addliked", async (req, res) => {
  const mongo = await mongoose.connection;
  const liked = mongo.db.collection("sahara_liked");
  var user = `${req.body.user}`;
  var product = `${req.body.product}`;
  var result = await liked.findOne({ user: user, product: product });
  if (user.length > 0 && product.length > 0 && result == null) {
    var result = await liked.insertOne({ user: user, product: product });
    res.send({ count: result.insertedCount });
  } else {
    res.send({ count: 0 });
  }
});

router.post("/getliked", async (req, res) => {
  const mongo = await mongoose.connection;
  const liked = mongo.db.collection("sahara_liked");
  var user = `${req.body.user}`;
  var temp;
  if (user.length > 0) {
    await liked.find({ user: user }, async (err, data) => {
      var dt = await data.toArray();
      var v = [];
      for (let i of dt) {
        temp = await getProduct(i["product"]);
        if (temp != null) {
          v.push(temp);
        }
      }
      res.send({ result: v });
    });
  } else {
    res.send({ result: [] });
  }
});

router.post("/isliked", async (req, res) => {
  const mongo = await mongoose.connection;
  const liked = mongo.db.collection("sahara_liked");
  var user = `${req.body.user}`;
  var product = `${req.body.product}`;
  if (user.length > 0) {
    await liked.find({ user: user, product: product }, async (err, data) => {
      var dt = await data.toArray();
      res.send({ result: dt.length > 0 });
    });
  } else {
    res.send({ result: false });
  }
});

router.post("/addcart", async (req, res) => {
  const mongo = await mongoose.connection;
  const cart = mongo.db.collection("sahara_cart");
  var user = `${req.body.user}`;
  var product = `${req.body.product}`;
  var quantity = `${req.body.quantity}`;
  var result = await cart.findOne({ user: user, product: product });
  if (user.length > 0 && product.length > 0 && result == null) {
    var result = await cart.insertOne({
      user: user,
      product: product,
      quantity: quantity,
    });
    res.send({ count: result.insertedCount });
  } else {
    var q = parseInt(result["quantity"]) + 1;
    if (q - 1 < 5) {
      var rs = await cart.updateOne(
        { user: user, product: product },
        { $set: { quantity: q.toString() } }
      );
      res.send({ count: rs.modifiedCount });
    }
    res.send({ count: 0 });
  }
});

router.post("/getcart", async (req, res) => {
  const mongo = await mongoose.connection;
  const liked = mongo.db.collection("sahara_cart");
  var user = `${req.body.user}`;
  var temp;
  if (user.length > 0) {
    await liked.find({ user: user }, async (err, data) => {
      var dt = await data.toArray();
      var v = [];
      for (let i of dt) {
        temp = await getProduct(i["product"]);
        temp.quantity = i["quantity"];
        if (temp != null) {
          v.push(temp);
        }
      }
      res.send({ result: v });
    });
  } else {
    res.send({ count: 0 });
  }
});

router.post("/removecart", async (req, res) => {
  const mongo = await mongoose.connection;
  var user = `${req.body.user}`;
  var product = `${req.body.product}`;
  const cart = mongo.db.collection("sahara_cart");
  var result = await cart.deleteOne({ user: user, product: product });
  res.send({ count: result.deletedCount });
});

router.post("/removeliked", async (req, res) => {
  const mongo = await mongoose.connection;
  var user = `${req.body.user}`;
  var product = `${req.body.product}`;
  const liked = mongo.db.collection("sahara_liked");
  var result = await liked.deleteOne({ user: user, product: product });
  res.send({ count: result.deletedCount });
});

router.post("/addproduct", async (req, res) => {
  const mongo = await mongoose.connection;
  const products = mongo.db.collection("sahara_products");
  var result = await products.insertMany(req.body);
  res.send({ count: result.insertedCount });
});

const removeSpaces = (s) => s.split(" ").join("");

router.post("/getproducts", async (req, res) => {
  const value = req.body.value;
  const mongo = await mongoose.connection;
  const products = mongo.db.collection("sahara_products");
  products.find({}, async (err, data) => {
    if (err) {
      res.send([]);
    } else {
      var r = await data.toArray();
      result = r.filter((i) =>
        removeSpaces(i["name"].toLowerCase()).includes(
          removeSpaces(value.toLowerCase())
        )
      );
      res.send(result);
    }
  });
});

router.post("/changequantity", async (req, res) => {
  var data = req.body;
  var mongo = await mongoose.connection;
  var col = mongo.db.collection("sahara_cart");
  var inc = eval(data.increase);
  var r = await col.updateOne(
    { user: data.user, product: data.product },
    { $set: { quantity: data.value } }
  );
  res.send({ result: r.modifiedCount > 0 });
});

module.exports = router;
