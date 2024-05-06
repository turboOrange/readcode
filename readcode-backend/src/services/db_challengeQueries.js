const defaultChallenges  = require('../config/default_challenges.json')
const { PrismaClient } = require('@prisma/client');
const openAIService = require("./openAI.service");
const userChallengeService = require("./db_userChallengeQueries");

async function getChallengeById (id) {
    const prisma = new PrismaClient({});
    const result = await prisma.challenge.findUnique({
        where: {
            id: parseInt(id),
        },
     });
     console.log(`found challenge from ID ${id}`);
    return result;
}

async function initChallenges(){
    const challengeCount = await getChallengeCount();
    console.log(`initiating challenges in the Database...`)
    if((typeof challengeCount == "undefined" || challengeCount == 0)){
        for (let i = 0; i < defaultChallenges.challenge_list.length; i++) { 
            await addChallenge(defaultChallenges.challenge_list[i]);
        }
        console.log(`initiated challenges in the Database`)
    }
    else {
        console.log(`you already have challenges in the database`)
    }
}

async function getChallengeCount(){
    const prisma = new PrismaClient({});
    const challengeCount = await prisma.challenge.count();
    return challengeCount;
}

async function addChallenge (challenge) {
    console.log("Adding challenge to DB..."); 
    const prisma = new PrismaClient({});
    const newChallenge = await prisma.challenge.create(
        {data: {
            langage: challenge.langage.toString(),
            difficulte: challenge.difficulte.toString(),
            enonce: challenge.enonce.toString(),
            solution: challenge.solution.toString(),
            generated: challenge.generated,
        },});
    console.log(`added challenge.`)
    return newChallenge;
}

async function addGeneratedChallenge(langage, difficulte) {
    try {
        console.log(`Creating new AI-Generated Challenge...`);
        const generatedChallenge = await openAIService.generateNewChallenge(langage, difficulte);
        console.log(`Created new AI-Generated challenge`);
        return await addChallenge(generatedChallenge);
    } catch (err) {
        if (err instanceof SyntaxError) {
            console.log(`---------ignoring json parse error from addGeneratedChallenge()---------`)
        }
        else {
            throw err;
        }
    }
}

async function udpateChallenge(challenge) {
    const prisma = new PrismaClient({});
    // call DB to update challenge
}

async function getChallengePreviews(language) {
    const prisma = new PrismaClient({});
    // retourner des previews selon les criteres voulus.
    // pour l'instant on retourne tout les challenges connus par la BD.
    if (language) {
        console.log(`Language is not undefined, it's : ${language}`)
        return await prisma.challenge.findMany({
            where: {
                langage: language
            }
        });
    }
    return await prisma.challenge.findMany({});
}

async function getAllChallengesForLanguageAndDifficulty(langage, difficulte){
    const prisma = new PrismaClient({});
    const challenges =  await prisma.challenge.findMany({
        where: {
            langage: langage,
            difficulte: difficulte,
        },
     });
     return challenges;
}


async function deleteChallenge(id){
    const prisma = new PrismaClient({});
    const challenge = prisma.challenge.delete({
        where: {
            id: Number(id)
        },
    });
    return challenge;
}

async function softDeleteChallenge(id){
    await userChallengeService.deleteUserChallengeByChallengeId(id);
    const challenge = await deleteChallenge(id);
    return challenge;
}

module.exports = {
    getChallengeById,
    addChallenge,
    udpateChallenge,
    addGeneratedChallenge,
    getChallengePreviews,
    getAllChallengesForLanguageAndDifficulty,
    initChallenges,
    softDeleteChallenge,
}