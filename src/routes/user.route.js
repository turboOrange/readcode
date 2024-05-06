const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const passport = require("passport");

router.post('/', userController.registerUser);

router.post('/authentication', checkNotAuthenticated, passport.authenticate('local'), userController.authenticateUser);
router.get('/isadmin', checkAuthenticated, userController.isAdmin);
router.get('/delete/:id', checkAuthenticated, userController.deleteUser);

router.get('/authentication/success', checkAuthenticated, userController.checkAuthenticationState);

router.put('/modification', checkAuthenticated, userController.updateUserProfile);

router.get('/:id', checkAuthenticated, userController.getUserById);

router.delete('/logout', (req,res,next) => {
    req.logOut((err) => {
        if (err) { next(err) }
        res.status(204).json({ message: "Logout success, redirecting...", redirectUrl: "/login"})
    });
});

function checkAuthenticated(req, res, next) {
    console.log("checking if authenticated...................")
    if (req.isAuthenticated()) {
        req.user.then(user => console.log(`User router checkAuthenticated -> Currently authenticated user : ${JSON.stringify(user, 2, null)}`))
        return next()
    }

    res.status(401).json({ message : "You're not logged in, please login" , redirectUrl:"/login"})
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.status(203).json({ message: "You're already logged in, redirecting you..."})
    }
    next()
}

module.exports = router;