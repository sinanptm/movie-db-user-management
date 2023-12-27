const userModel = require('../models/userModel')
const checkLoginStatus = (req, res, next) => {
    try {
        if (req.session.user_id || req.cookies.userToken) {
            res.redirect('/home');
        } else {
            next();
        }
    } catch (err) {
        console.log('Error checking login status:', err.message);
        res.status(500).send('Internal Server Error');
    }
};

const redirectLogin = (req, res, next) => {
    try {
        if (req.session.user_id ||req.cookies.userToken) {
            next();
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log('Error checking login status:', err.message);
    }
}

const registerCheck = async (req, res, next) => {
    try {
           next();
        
            
    } catch (err) {
        console.log(err);
    }
}



module.exports = {
    checkLoginStatus,
    redirectLogin,
    registerCheck,
}