const checkLoginStatus = (req, res, next) => {
    try {
        
        if (req.session.admin || req.cookies.adminToken) {
            res.redirect('/admin/dashboard');
        } else {
            next();
        }
    } catch (err) {
        console.error('Error checking login status:', err.message);
        res.status(500).send('Internal Server Error');
    }
};

const redirectLogin = (req, res, next) => {
    try {
        if (req.session.admin || req.cookies.adminToken) {
            next();
        } else {
            res.redirect('/admin');
        }
    } catch (err) {
        console.error('Error in redirectLogin middleware:', err.message);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    checkLoginStatus,
    redirectLogin,
}