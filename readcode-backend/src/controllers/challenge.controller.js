const openAIService = require("../services/openAI.service");
const db_challengeQueries = require("../services/db_challengeQueries");
const db_userChallengeQueries = require("../services/db_userChallengeQueries");
const supported_languages = require("../config/supported_languages.json");
const DIFFICULTIES = ["easy","medium","hard"];

// POST : Route pour qu'un utilisateur puisse enregistrer un defi
async function registerNewChallenge(req, res, next) {
    try {
        // validations si necessaires (on peut utiliser Express-Validator si trop de validations)
        if (!req.body) { //l'objet JSON contenant le challenge recu
            return res.status(400).json({
                message: "Message d'erreur que le client recoit comme response"
            })
        }
        req.body.generated = false;
        req.body.solution = openAIService.generateSolution(req.body.enonce);
        console.log(`inside registerNewChallenge()`);
        console.log(req.body);
        // valider le challenge object

        // ajouter le challenge a la BD
        const addConfirmation = await db_challengeQueries.addChallenge(req.body);

        // retourner le challenge, et diriger l'utilisateur a l'url challenge/${addConfirmation.id}
        res.status(201).json({
            message: "Challenge ajoute avec succes"
        })
    } catch (err) {
        console.error(`Erreur lors de registerNewChallenge : ${err}`)
        next(err);
    }
}

// GET
async function getChallengeById(req, res, next) {
    try {
        const challengeId = req.params?.id;
        const user = await req.user;
        const challenge = await db_challengeQueries.getChallengeById(challengeId);

        // *UPDATE* : on veut aussi retourner le dernier feedback associe a ce challenge maintenant
        const userChallenge = await db_userChallengeQueries.getUserChallengeByUserChallenge(user.id, challengeId);

      //  res.status(200).json({challenge : challenge, feedback : feedback});
        res.status(200).json({challenge, userChallenge});
    } catch (err) {
        console.error(`Erreur lors de getChallengeById : ${err}`)
        next(err);
    }
}

// GET
/*async function getAllChallengesForLanguage(req, res, next) {
    try {
        const challenges = await db_challengeQueries.getAllChallengesForLanguage(req.body.langage, req.body.difficulte);
        res.status(200).json(challenges);
    } catch (err) {
        console.error(`Erreur lors de getAllChallengesForLanguage : ${err}`)
        next(err);
    }
}*/

// POST
async function getAnswerEvaluation(req, res, next) {
    try {
        const challengeId = req.params?.id;
        const user = await req.user;
        const challenge = await db_challengeQueries.getChallengeById(challengeId);

        console.log(`User Answer : ${req.body.answer}`);
        
        const solution = await openAIService.evaluateAnswer(challenge, req.body.answer);

        // ---- TOUT CA DOIT RENTRER DANS UNE FONCTION (début) ----
        // est supposé retourner 1 seul objet, qui est l'état courant du challenge x pour l'utilisateur y
        const userChallenge = await db_userChallengeQueries.getUserChallengeByUserChallenge(user.id, challengeId);
        let newUserChallenge = {};

        // si on trouve que ce challenge a déjà été résolu pour cet utilisateur là
        if(userChallenge !== null && userChallenge !==undefined){
            // mettre à jour le score
            console.log(`Mise a jour du UserChallenge...`);
            newUserChallenge = await db_userChallengeQueries.updateUserChallenge(user.id, challengeId, solution);
            console.log(`UserChallenge mis a jour.`);
        }else{
            // sinon, enregistrer ce challenge pour l'utilisateur courant
            console.log(`Insertion d'un nouveau UserChallenge pour ${JSON.stringify(req.user)}...`)
            newUserChallenge = await db_userChallengeQueries.addUserChallenge(user.id, challengeId, solution);
            console.log(`Added UserChallenge.`);
        }

        res.status(200).json(newUserChallenge);

        // ---- TOUT CA DOIT RENTRER DANS UNE FONCTION (fin) ----

        // ---- TOUT CA DOIT RENTRER DANS UNE FONCTION (début) ----
        //create new challenge if last of the categorie.
        const usersCompletedChallenge = await db_userChallengeQueries.getUserChallengesByUser(user.id);
        const challengeList = await db_challengeQueries.getAllChallengesForLanguageAndDifficulty(challenge.langage, challenge.difficulte);

        //figure out if there is still one challenge.
        var stillOneChallenge = false;
        for (let i = 0; i < challengeList.length; i++) { 
            var isIn = false;
            for (let j = 0; j < usersCompletedChallenge.length; j++) { 
                var completedChallengeId = usersCompletedChallenge[j].challengeId;
                if(challengeList[i].id == completedChallengeId){
                    isIn = true;
                    break;
                }
            }
            if(!isIn){
                stillOneChallenge = true;
                break;
            }
        }
        
        //if there is no other, create one.
        if(!stillOneChallenge){
            console.log(`Adding new challenge for language and difficulty...`)
            await db_challengeQueries.addGeneratedChallenge(challenge.langage, challenge.difficulte);
        }

        return
        // ---- TOUT CA DOIT RENTRER DANS UNE FONCTION (fin) ----
    } catch (err) {
        console.error(`Erreur lors de getAnswerEvaluation : ${err}`)
        next(err);
    }
}

async function getLanguages(req, res, next) { 
    const {languages} = supported_languages;
    res.status(200).json(languages);
}

async function getChallengePreviews(req, res, next) {
    try {
        let language = req?.query?.language === "null" ? null : req?.query?.language;
        console.log(`** LANGUAGE RECEIVED: ${language} **`)

        let challengePreviews = await db_challengeQueries.getChallengePreviews(language);

        if (!challengePreviews.length) {
            if (!language) language="Python"; console.log(`No previews, no language specified`)

            // appeller openAI pour generer 3 challenges de ce langage, difficultes easy, medium ,hard.
            challengePreviews = await Promise.all(DIFFICULTIES.map(async difficulty => {
                try {
                    const challenge = await db_challengeQueries.addGeneratedChallenge(language, difficulty);
                    return challenge
                } catch (err) {
                    console.log(`xxxxxxxxx ignoring json parse err xxxxxxxxx`)
                }
                })
            );
        }

        challengePreviews.forEach(challenge => console.log(`************* CHALLENGE ID : ${challenge?.id}`));
        // au cas ou la boucle nous retourne un challenge qui n'a pas ete ajoute a la bd
        const finalChallengePreviews = challengePreviews.filter(challenge => challenge?.id != undefined);
        console.log(`Challenge Previews found : ${finalChallengePreviews.length}`);
        if (!finalChallengePreviews.length) {
            console.log(`No challenges found.`)
            res.status(404).json({message:"Aucun challenge trouve..."})
        }
        res.status(200).json(finalChallengePreviews);
    } catch (err) {
        console.error(`Erreur lors de getChallengePreviews : ${err}`)
        console.log(`${JSON.stringify(err)}`)
        next(err);
    }
}

// GET
async function deleteChallenge(req, res, next){
    try {
        console.log(`~~~ INSIDE deleteChallenge ~~~`)
        const user = await req.user;

        if(user?.isAdmin){
            const id = req.params.id
            
            if (!id) {
                return res.status(400).json({
                    message: `Missing ID`
                })
            }
    
            const user = await db_challengeQueries.softDeleteChallenge(req.params.id);
            res.status(200).json(user);
        }else{
            return res.status(401).json({
                message: `Not admin`
            })
        }

    } catch(err){
        console.error(`Erreur lors de deleteChallenge : ${err}`)
        next(err);
    }
}

async function getGlobalAverages(req, res, next){
    try{
        console.log(`Getting Global averages...`)
        const averages = await db_userChallengeQueries.getGlobalAverages();
        res.status(200).json(averages);
    } catch(err){
        console.error(`Erreur lors de getGlobalAverages : ${err}`)
        next(err);
    }
}

async function getLeaderBoard(req, res, next){
    try{
        const leaderBoard = await db_userChallengeQueries.getLeaderBoard();
        res.status(200).json(leaderBoard);
    } catch(err){
        console.error(`Erreur lors de getLeaderBoard : ${err}`)
        next(err);
    }
}

async function getPersonalAverages(req, res, next){
    try{
        console.log(`Getting Personal averages...`)
        const thisUser = await req.user;
        const averages = await db_userChallengeQueries.getPersonalAverages(thisUser.id);
        res.status(200).json(averages);
    } catch(err){
        console.error(`Erreur lors de getPersonalAverages : ${err}`)
        next(err);
    }
}

module.exports = {
    registerNewChallenge,
    getChallengePreviews,
    getChallengeById,
    getAnswerEvaluation,
    getLanguages,
    deleteChallenge,
    getGlobalAverages,
    getPersonalAverages,
    getLeaderBoard,
    //getAllChallengesForLanguage,
};