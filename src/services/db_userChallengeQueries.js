const { PrismaClient } = require('@prisma/client');

// preferablement il faudrait faire une fonction qui formatte bien le feedback pour l'insertion du UserChallenge dans le BD
async function addUserChallenge(userId, challengeId, feedback){
    const prisma = new PrismaClient({});
    if(typeof score == "string"){
        score = score.split("%")[0]
    }
    return await prisma.userChallenge.create({
        data: {
            userId:              Number(userId),
            challengeId:         Number(challengeId),
            correctude:          Number(feedback.correctness.score),
            general:             Number(feedback.overall.score),
            completude:          Number(feedback.completeness.score),
            clarete:             Number(feedback.clarity.score),
            profondeur:          Number(feedback.depth.score),
            intro:               feedback.introduction.toString(),
            correctudeTxt:       feedback.correctness.feedback,
            completudeTxt:       feedback.completeness.feedback,
            clareteTxt:          feedback.clarity.feedback,
            profondeurTxt:       feedback.depth.feedback,
            generalTxt:          feedback.overall.feedback.toString(),
        },
    });
}

// preferablement il faudrait faire une fonction qui formatte bien le feedback pour l'insertion du UserChallenge dans le BD
async function updateUserChallenge(userId, challengeId, feedback){
    const prisma = new PrismaClient({});
    const updatedUserChallenge =  await prisma.userChallenge.update({
        where: {
            userId_challengeId: {
                userId: Number(userId), 
                challengeId: Number(challengeId)},
        },        
        data: {
            correctude:          Number(feedback.correctness.score),
            general:             Number(feedback.overall.score),
            completude:          Number(feedback.completeness.score),
            clarete:             Number(feedback.clarity.score),
            profondeur:          Number(feedback.depth.score),
            intro:               feedback.introduction.toString(),
            correctudeTxt:       feedback.correctness.feedback,
            completudeTxt:       feedback.completeness.feedback,
            clareteTxt:          feedback.clarity.feedback,
            profondeurTxt:       feedback.depth.feedback,
            generalTxt:          feedback.overall.feedback.toString(),
        },
     });
     return updatedUserChallenge;
}

async function getUserChallengesByUser(userId){
    const prisma = new PrismaClient({});
    const userChallenges =  await prisma.userChallenge.findMany({
        where: {
            userId: Number(userId),
        },
     });
     return userChallenges;
}

async function getUserChallengeByChallenge(challengeId){
    const prisma = new PrismaClient({});
    const userChallenges =  await prisma.userChallenge.findMany({
        where: {
            challengeId: Number(challengeId),
        },
     });
     return userChallenges;
}

async function getUserChallengeByUserChallenge(userId, challengeId){
    const prisma = new PrismaClient({});
    // cast les valeurs en int
    const composite = {
        userId: Number(userId),
        challengeId: Number(challengeId)
    }

    const userChallenge =  await prisma.userChallenge.findUnique({
        where: {
            userId_challengeId: { 
                ...composite
            }
        },
     });
     console.log("userChallenge trouve :" + JSON.stringify(userChallenge, 2, null)); 
     return userChallenge;
}

async function deleteUserChallengeByUserId(userId){
    const prisma = new PrismaClient({});
    await prisma.userChallenge.deleteMany({
        where:{
            userId: Number(userId),
        }
    })
}

async function deleteUserChallengeByChallengeId(challengeId){
    const prisma = new PrismaClient({});
    await prisma.userChallenge.deleteMany({
        where:{
            challengeId: Number(challengeId),
        }
    })
}

async function getGlobalAverages(){
    const prisma = new PrismaClient({});
    const aggregations = await prisma.userChallenge.aggregate({
        _avg: {
            general:    true,
            correctude: true,
            completude: true,
            clarete:    true,
            profondeur: true,
        },
    })
    return aggregations;
}

async function getPersonalAverages(userId){
    const prisma = new PrismaClient({});
    const aggregations = await prisma.userChallenge.aggregate({
        _avg: {
            general:    true,
            correctude: true,
            completude: true,
            clarete:    true,
            profondeur: true,
        },
        where: {
            userId: userId,
          }
    })
    return aggregations;
}

async function getLeaderBoard(){
    const prisma = new PrismaClient({});
    const users = await prisma.user.findMany({select:{
        id: true,
        username: true,
        email: true
    }});

    const leaderBoard = await prisma.userChallenge.groupBy({
        by: ['userId'],
        _avg: {
            general: true,
        },
        orderBy: {
            _avg: {
                general: 'asc',
            },
        }
    });

    const leaderBoardWithUsers = [];
    for (let i = 0; i < leaderBoard.length; i++) {
        for (let j = 0; j < users.length; j++) {
            if (leaderBoard[i].userId == users[j].id) {
                let element = {
                    ...leaderBoard[i],
                    username: users[j].username,
                    email: users[j].email,
                }
                leaderBoardWithUsers.push(element);
            }
        }
    }
    return leaderBoardWithUsers;
}


module.exports = {
    addUserChallenge,
    getUserChallengesByUser,
    getUserChallengeByChallenge,
    getUserChallengeByUserChallenge,
    updateUserChallenge,
    deleteUserChallengeByUserId,
    deleteUserChallengeByChallengeId,
    getGlobalAverages,
    getPersonalAverages,
    getLeaderBoard,
}