const express = require("express");
const userRoute = express()
const path = require("path");
const  userController = require("../controllers/userController")
const multer = require("multer")
const session = require("express-session")
const { checkLoginStatus, redirectLogin , registerCheck} = require("../middleware/userAuth");
const nocache = require("nocache")
const sSecret = require("../config/config")
const cookieParser = require("cookie-parser");

userRoute.use(nocache());
userRoute.use(session({
    secret:sSecret,
    resave:true,
    saveUninitialized:true
}))
userRoute.use(cookieParser());

userRoute.set('view engine','ejs')
userRoute.set('views', path.join(__dirname,"../views/user"));
userRoute.use(express.static(path.join(__dirname, 'views/public')));

userRoute.use(express.json());
userRoute.use(express.urlencoded({extended:true}))

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/userFiles"))
    },
    filename:(req,file,cb)=>{
        cb(null,Math.random()+"-users"+file.originalname)
    }
})

const upload = multer({storage: storage});

// userRoute.all('*', (req, res, next) => {
//     console.log('user on site');
//     next();
// });
userRoute.locals.title = 'MoviesHub';


userRoute.post("/register", upload.single("file"), userController.insertRegister);
userRoute.get("/register", registerCheck,userController.loadeRegister);

userRoute.get("/", checkLoginStatus, userController.loadLogin);
userRoute.get("/login", checkLoginStatus, userController.loadLogin);
userRoute.post("/login", userController.checkLogin);

userRoute.get("/home", redirectLogin, userController.loadhome);

userRoute.get("/lfdocfdsdfsgfodsfufdt",redirectLogin ,userController.logout);

// userRoute.use((req, res, next) => {
//     res.status(404).render('404')
// });


module.exports = userRoute;

