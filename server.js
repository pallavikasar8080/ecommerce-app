const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

/* ================== DATABASE ================== */
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error:", err));

/* ================== MODELS ================== */

// Product Model
const Product = mongoose.model("Product", {
  name: String,
  price: Number,
  image: String
});

// User Model
const User = mongoose.model("User", {
  email: String,
  password: String
});

/* ================== ROUTES ================== */

// Root route
app.get("/", (req, res) => {
  res.send("Server Working ✅");
});

/* ---------- PRODUCT ROUTES ---------- */

// ✅ CLEAR PRODUCTS
app.get("/clear", async (req, res) => {
  try {
    await Product.deleteMany({});
    res.send("All products deleted ❌");
  } catch (err) {
    res.status(500).send("Error clearing products");
  }
});

// ✅ ADD PRODUCTS (ONLY ONCE + STABLE IMAGES)
app.get("/add", async (req, res) => {
  try {
    const count = await Product.countDocuments();

    if (count > 0) {
      return res.send("Products already exist ⚠️");
    }

    await Product.insertMany([
      { name: "Laptop", price: 50000, image: "https://picsum.photos/200?random=1" },
      { name: "Mobile", price: 20000, image: "https://picsum.photos/200?random=2" },
      { name: "Headphones", price: 3000, image: "https://picsum.photos/200?random=3" },
      { name: "Watch", price: 5000, image: "https://picsum.photos/200?random=4" },
      { name: "Shoes", price: 2500, image: "https://picsum.photos/200?random=5" },
      { name: "Bag", price: 1500, image: "https://picsum.photos/200?random=6" },
      { name: "Keyboard", price: 1200, image: "https://picsum.photos/200?random=7" },
      { name: "Mouse", price: 800, image: "https://picsum.photos/200?random=8" },
      { name: "Tablet", price: 15000, image: "https://picsum.photos/200?random=9" },
      { name: "Camera", price: 30000, image: "https://picsum.photos/200?random=10" }
    ]);

    res.send("Products Added Successfully ✅");

  } catch (err) {
    res.status(500).send("Error adding products");
  }
});

// GET PRODUCTS
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Error fetching products");
  }
});

// ADD PRODUCT
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.send("Product added successfully ✅");
  } catch (err) {
    res.status(500).send("Error adding product");
  }
});

/* ---------- AUTH ROUTES ---------- */

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("User already exists ❌");
    }

    await User.create({ email, password });

    res.send("Signup successful ✅");

  } catch (err) {
    res.status(500).send("Signup error");
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Wrong password" });
    }

    res.json({ success: true, message: "Login successful" });

  } catch (err) {
    res.status(500).send("Login error");
  }
});

// FORGOT PASSWORD
app.post("/forgot", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send("User not found ❌");
    }

    res.send("Your password is: " + user.password);

  } catch (err) {
    res.status(500).send("Error");
  }
});

/* ================== SERVER ================== */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});