const express = require("express");
const adminRouter = express();
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const sSession = require("../config/config");
const adminController = require("../controllers/adminController");
const auth = require("../middleware/adminAuth");
const {checkLoginStatus,redirectLogin } = require("../middleware/adminAuth")
const multer = require("multer")


adminRouter.use(session({
    secret: sSession,
    resave: true,
    saveUninitialized: true
}));    
adminRouter.use(cookieParser());

adminRouter.locals.title = 'ADMIN HUB';

adminRouter.use(express.urlencoded({ extended: true }));
adminRouter.use(express.json());

adminRouter.set('view engine', 'ejs');
adminRouter.set('views', path.join(__dirname, '../views/admin'));
adminRouter.use(express.static(path.join(__dirname, '../public/userFiles')));


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/userFiles"))
    },
    filename:(req,file,cb)=>{
        cb(null,Math.random()+"-users"+file.originalname)
    }
})

const upload = multer({storage: storage});


adminRouter.get("/",checkLoginStatus, adminController.loadLogin);
adminRouter.get("/login",checkLoginStatus, adminController.loadLogin);
adminRouter.get("/register",checkLoginStatus, adminController.loadLogin);
adminRouter.post('/', adminController.verifyLogin);

adminRouter.get("/dashboard", redirectLogin, adminController.loadDashboard);

adminRouter.get("/delete", redirectLogin, adminController.deleteUser);

adminRouter.post("/newUser",  upload.single("file"), adminController.newUser);


adminRouter.post("/edit/mail", redirectLogin, adminController.editUsermail);
adminRouter.post("/edit/name", redirectLogin, adminController.editUsername);

adminRouter.get("/logoutsdffhfkgvhkjdjdfhjsdh", redirectLogin,adminController.loadLogout);

module.exports = adminRouter