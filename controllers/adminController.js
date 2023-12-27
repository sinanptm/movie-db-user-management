const userModels = require("../models/userModel");

const bcrypt = require("bcrypt");

const loadLogin = (req, res) => {
  try {
    res.render("login.ejs");
  } catch (err) {
    console.log(err.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModels.User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        if (user.is_admin) {
          req.session.admin = user._id;
          res.cookie("adminToken", user._id.toString(), {
            maxAge: 30 * 24 * 60 * 60 * 1000,
          });
          res.redirect("/admin/dashboard");
        } else {
          res.render("login", { msg: "Email and password is incorrect" });
        }
      } else {
        res.render("login", { msg: "Incorrect password" });
      }
    } else {
      res.render("login", { msg: "Incorrect email and password" });
    }
  } catch (err) {
    console.log(err.message);
  }
};
const loadDashboard = async (req, res) => {
  try {
    const users = await userModels.User.find().sort({ is_admin: -1 });
    const shows = await userModels.Show.aggregate([{ $sort: { name: -1 } }]);
    const id = req.cookies.adminToken;
    const user = await userModels.User.findOne(
      { _id: id },
      { name: 1, file:1 ,_id: 0 }
    );
    var names =  user.name ; 
    var src = user.file
    res.render("dashboard.ejs", { users, title: "Dashboard", shows, names , src});
  } catch (err) {
    console.log(err.message);
  }
};

const loadLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken");
    res.clearCookie("userToken");
    req.session.destroy();
    res.redirect("/");
    console.log('admin loged out');
  } catch (error) {
    console.log(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    if (id === req.session.admin || id === req.cookies.adminToken) {
      res.clearCookie("adminToken");
      res.clearCookie("userToken");
      req.session.destroy();
    }

    const user = await userModels.User.findByIdAndDelete(id);
    if (user !== null) {
      console.log("User deleted");
    } else {
      console.log(`There is no user with id ${id}`);
    }

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.log(err.message);
  }
};

const editUsermail = async (req, res) => {
  try {
    const id = req.query.id; 
    const newmail = req.body.new;

    if (newmail !== undefined && newmail !== null) {
      console.log(id);
      await userModels.User.findByIdAndUpdate(
        { _id: id },
        { $set: { email: newmail } }
      );
      res.redirect("/admin");
      console.log(" new mail: " + newmail);
    } else {
      res
        .status(400)
        .send("Invalid request: newmail is missing in the request body");
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
};

const editUsername = async (req, res) => {
  try {
    const id = req.query.id; 
    const newname = req.body.new;
    await userModels.User.updateOne({ _id: id }, { $set: { name: newname } });
    res.redirect("/admin");
    console.log(" new name: " + newname);
  } catch (err) {
    console.log(err.message);
  }
};

const securePass = async (pass)=>{
  try {
    return await bcrypt.hash(pass,10)
  } catch (err) {
    console.log(err.message);
  }

}

const newUser = async (req,res)=>{
  const users = await userModels.User.find().sort({ is_admin: -1 , name:1});
  const shows = await userModels.Show.aggregate([{ $sort: { name: -1 } }]);
  const id = req.cookies.adminToken;
  const user = await userModels.User.findOne({ _id: id },{ name: 1, file:1 , _id: 0 });
  const names =  user.name ; 
  const src = user.file
try {
  const newMail = await req.body.email;
  const Cmail = await userModels.User.findOne({ email: newMail });
  if (Cmail===null) {
    const spass = await securePass(req.body.password);
    const newUser = new userModels.User({
      name: req.body.name,
      email: req.body.email,
      password: spass,
      file: req.file.filename,
    });
    await newUser.save();
    console.log("User registration successful.");
    res.redirect('/admin')
  }else{
    res.render("dashboard", {msg: "Email already exists. Please re-enter the mail.",users,title: "Dashboard",shows,names , src});
  }
} catch (err) {
  console.log("User registration failed:", err.message);
  res.render("dashboard", {msg: "User registration has failed. Please register. one more",users,title: "Dashboard",shows,names , src});
}
}

module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  loadLogout,
  deleteUser,
  editUsername,
  editUsermail,
  newUser
};
