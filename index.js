const express = require('express');
const mongoose = require("mongoose");

const app = express();

const userRoute = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");

mongoose.connect("mongodb://127.0.0.1:27017/My_management_system");

// for user routes
app.use('/',userRoute);
app.use('/admin', adminRouter);
app.use((req, res, next) => {
    res.status(404)
    res.send(`<style>body{text-align:center;color:blue;padding:100px;background:url('https://ssl.gstatic.com/accounts/embedded/signin_tapyes.gif') center/contain no-repeat;}h1{font-size:50px;margin-bottom:20px;}p{font-size:18px;}</style></head><body><a style="color:red;" href="http://localhost:8080">home</a><h1>404 Not Found</h1><p>Sorry, the page you are looking for might be in another castle.</p>`);
});

app.listen(8080, () => {
    console.log('listening on port http://localhost:8080');
});
