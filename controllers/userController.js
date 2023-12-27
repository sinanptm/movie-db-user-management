const userModels = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { cache } = require("ejs");

const securePassword = async (pass) => {
  try {
    const hashpass = await bcrypt.hash(pass, 10);
    return hashpass;
  } catch (error) {
    console.log(error.message);
  }
};

const insertRegister = async (req, res) => {
  try {
    const nmail = await req.body.email;
    const omail = await userModels.User.findOne({ email: nmail });
    if (omail==null) {
      const spass = await securePassword(req.body.password);
      const newUser = new userModels.User({
        name: req.body.name,
        email: req.body.email,
        password: spass,
        file: req.file.filename,
      });
      await newUser.save();
      console.log("User registration successful.");
      res.render("login", {msg: "User registration successful. Please login.",});
    } else {
      res.render("register", {msg: `mail already exists. Please re-enter your mail.`,});
      console.log('Mail already exists');
    }
  } catch (err) {
    console.log("User registration failed:", err.message);
    res.render("register", {msg: "User registration has failed. Please register.",});
  }
};

const loadeRegister = (req, res) => {
  try {
    res.render("register");
  } catch (err) {
    console.log(err.message);
  }
};

const loadLogin = (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err.message);
  }
};

const checkLogin = async (req, res) => {
  const data = await userModels.User.findOne({ email: req.body.email });
  if (data) {
    if (await bcrypt.compare(req.body.password, data.password)) {
      req.session.user_id = data._id;
      res.cookie("userToken", data._id.toString(), {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.redirect("/home");
    } else {
      res.render("login", { msg: "Incorrect email and password." });
    }
  } else {
    res.render("login", { msg: "Incorrect email and password." });
  }
};

const loadhome = async (req, res) => {
  try {
    let aggregationPipeline;

    if (req.query.type) {
      if (req.query.type == "Anime") {
        var category = "Animes";
      } else {
        var category = "Movies";
      }

      aggregationPipeline = [{ $match: { category: category } }];
    } else {
      aggregationPipeline = [{ $sample: { size: 18 } }];
    }

    const show = await userModels.Show.aggregate(aggregationPipeline);
    res.render("home", { show });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("userToken");
    req.session.destroy();
    console.log("User logged out.");
    res.redirect("/login");
  } catch (err) {
    console.log(err.message + ": " + "error during logout process");
    res.redirect("/home");
  }
};

module.exports = {
  loadeRegister,
  insertRegister,
  loadLogin,
  checkLogin,
  loadhome,
  logout,
};
