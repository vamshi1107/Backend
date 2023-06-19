const e = require("express");
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/login", async (req, res) => {
  const mongo = await mongoose.connection;
  const users = mongo.db.collection("sahara_users");
  let user = req.body.user;
  let pass = req.body.pass;
  await users.find({ user: user, password: pass }, async (err, data) => {
    if (err) {
      res.send({});
    } else {
      let r = await data.toArray();
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
  let v = await products.findOne({ id: id });
  return v;
}

router.post("/signup", async (req, res) => {
  const mongo = await mongoose.connection;
  const users = mongo.db.collection("sahara_users");
  let user = `${req.body.user}`;
  let pass = `${req.body.pass}`;
  let name = `${req.body.name}`;
  if (user.length > 0 && pass.length > 0 && name.length > 0) {
    let result = await users.insertOne({
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
  let user = `${req.body.user}`;
  let product = `${req.body.product}`;
  let result = await liked.findOne({ user: user, product: product });
  if (user.length > 0 && product.length > 0 && result == null) {
    let result = await liked.insertOne({ user: user, product: product });
    res.send({ count: result.insertedCount });
  } else {
    res.send({ count: 0 });
  }
});

router.post("/getliked", async (req, res) => {
  const mongo = await mongoose.connection;
  const liked = mongo.db.collection("sahara_liked");
  let user = `${req.body.user}`;
  let temp;
  if (user.length > 0) {
    await liked.find({ user: user }, async (err, data) => {
      let dt = await data.toArray();
      let v = [];
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
  let user = `${req.body.user}`;
  let product = `${req.body.product}`;
  if (user.length > 0) {
    await liked.find({ user: user, product: product }, async (err, data) => {
      let dt = await data.toArray();
      res.send({ result: dt.length > 0 });
    });
  } else {
    res.send({ result: false });
  }
});

router.post("/addcart", async (req, res) => {
  const mongo = await mongoose.connection;
  const cart = mongo.db.collection("sahara_cart");
  let user = `${req.body.user}`;
  let product = `${req.body.product}`;
  let quantity = `${req.body.quantity}`;
  let result = await cart.findOne({ user: user, product: product });
  if (user.length > 0 && product.length > 0 && result == null) {
    let result = await cart.insertOne({
      user: user,
      product: product,
      quantity: quantity,
    });
    res.send({ count: result.insertedCount });
  } else {
    let q = parseInt(result["quantity"]) + 1;
    if (q - 1 < 5) {
      let rs = await cart.updateOne(
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
  const cart = mongo.db.collection("sahara_cart");
  let user = `${req.body.user}`;
  let temp;
  if (user.length > 0) {
    await cart.find({ user: user }, async (err, data) => {
      let dt = await data.toArray();
      let v = [];
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

router.post("/getorders", async (req, res) => {
  const mongo = await mongoose.connection;
  const orders = mongo.db.collection("sahara_orders");
  let user = `${req.body.user}`;
  if (user.length > 0) {
    await orders.find({ user: user }, async (err, data) => {
      let dt = await data.toArray();
      let v = [];
      for (let i of dt) {
        let temp = await Promise.all(
          i["items"].map(async (e) => {
            let p = await getProduct(e["product"]);
            return { ...i, ...p, ...e };
          })
        );
        console.log(temp);
        v = [...v, ...temp];
      }
      res.send({ result: v });
    });
  } else {
    res.send({ count: 0 });
  }
});

router.post("/removecart", async (req, res) => {
  const mongo = await mongoose.connection;
  let user = `${req.body.user}`;
  let product = `${req.body.product}`;
  const cart = mongo.db.collection("sahara_cart");
  let result = await cart.deleteOne({ user: user, product: product });
  res.send({ count: result.deletedCount });
});

router.post("/removeliked", async (req, res) => {
  const mongo = await mongoose.connection;
  let user = `${req.body.user}`;
  let product = `${req.body.product}`;
  const liked = mongo.db.collection("sahara_liked");
  let result = await liked.deleteOne({ user: user, product: product });
  res.send({ count: result.deletedCount });
});

router.post("/addproduct", async (req, res) => {
  const mongo = await mongoose.connection;
  const products = mongo.db.collection("sahara_products");
  let result = await products.insertMany(req.body);
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
      let r = await data.toArray();
      result = r.filter((i) =>
        removeSpaces(i["name"].toLowerCase()).includes(
          removeSpaces(value.toLowerCase())
        )
      );
      res.send(result);
    }
  });
});

router.get("/allproducts", async (req, res) => {
  const mongo = await mongoose.connection;
  const products = mongo.db.collection("sahara_products");
  products.find({}, async (err, data) => {
    if (err) {
      res.send([]);
    } else {
      let r = await data.toArray();
      res.send(r);
    }
  });
});

router.post("/changequantity", async (req, res) => {
  let data = req.body;
  let mongo = await mongoose.connection;
  let col = mongo.db.collection("sahara_cart");
  let inc = eval(data.increase);
  let r = await col.updateOne(
    { user: data.user, product: data.product },
    { $set: { quantity: data.value } }
  );
  res.send({ result: r.modifiedCount > 0 });
});

router.post("/addaddress", async (req, res) => {
  console.log(req.body);
  let data = req.body;
  data["addressId"] = data["user"] + parseInt(Math.random() * 1000000);
  let mongo = await mongoose.connection;
  let col = mongo.db.collection("sahara_address");
  let result = await col.insertOne(data);
  res.send({ count: result.insertedCount });
});

router.post("/getaddresses", async (req, res) => {
  let user = req.body.user;
  let mongo = await mongoose.connection;
  let col = mongo.db.collection("sahara_address");
  col.find({ user: user }, async (err, data) => {
    if (err) {
      res.send({ result: false, data: [] });
    } else {
      let list = await data.toArray();
      res.send({ result: true, data: list });
    }
  });
});

router.post("/placeorder", async (req, res) => {
  let body = req.body;
  let mongo = await mongoose.connection;
  let items = [];
  await mongo.db
    .collection("sahara_cart")
    .find({ user: body.user }, async (err, data) => {
      if (err) {
        res.send({ result: false });
      } else {
        items = await data.toArray();
      }
    });
  let address = await mongo.db
    .collection("sahara_address")
    .findOne({ user: body.user, addressId: body.address });
  let col = mongo.db.collection("sahara_orders");
  let data = {};
  data["items"] = items;
  data["user"] = body.user;
  data["orderid"] = body.user + parseInt(Math.random() * 10000000);
  data["status"] = "pending";
  data["addressId"] = body.address;
  data["address"] = address;
  data["message"] = "Processing Your Order";
  let result = await col.insertOne(data);
  if (result.insertedCount > 0) {
    await mongo.db.collection("sahara_cart").deleteMany({ user: body.user });
  }
  res.send({ result: result.insertedCount > 0, count: result.insertedCount });
});

module.exports = router;
