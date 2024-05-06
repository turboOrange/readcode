const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge.controller');

router.post('/', checkAuthenticated, challengeController.registerNewChallenge);

router.get('/previews', checkAuthenticated, challengeController.getChallengePreviews);

router.get('/languages', checkAuthenticated, challengeController.getLanguages);
router.get('/globalaverages',  challengeController.getGlobalAverages);
router.get('/leaderboard',  challengeController.getLeaderBoard);
router.get('/personalaverages', checkAuthenticated, challengeController.getPersonalAverages);

router.get('/:id', checkAuthenticated, challengeController.getChallengeById);
router.delete('/:id', checkAuthenticated, challengeController.deleteChallenge);
router.post('/:id/evaluation', checkAuthenticated, challengeController.getAnswerEvaluation);

function checkAuthenticated(req, res, next) {
    console.log("checking if authenticated from challenge router...");
    if (req.isAuthenticated()) {
        console.log("Is Authenticated!")
        return next()
    }

    res.status(401).json({ message : "You're not logged in, please login" , redirectUrl:"/login"})
}

module.exports = router;