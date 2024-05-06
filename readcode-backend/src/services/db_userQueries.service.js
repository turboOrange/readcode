const defaultUsers = require('../config/default_users.json')
const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcrypt");
const userChallengeService = require("./db_userChallengeQueries");


async function addUser (user) {
    console.log("Adding user:" + user.toString()); 
    const prisma = new PrismaClient({});
    const hashedPass = await bcrypt.hash(user.password, 10);
    return userReturned = await prisma.user.create({
        data: {
            name: user.name.toString(),
            username: user.username.toString(),
            password: hashedPass,
            email: user.email.toString(),
            isAdmin: user?.isAdmin
        },
    });
}

async function udpateUserProfile(userModification, currentUser) {
    try {
        const currentUserId = currentUser.id; 
        const hashedPass = await bcrypt.hash(userModification.password, 10);
        userModification.password = hashedPass;

        delete userModification.id;
        // TODO : verifier que password === confirmPassword sinon throw error
        delete userModification.confirmPassword;

        const prisma = new PrismaClient({});
        const updateUser = await prisma.user.update({
            where: {
                id: currentUserId//userModification.id,
            },
            data : {
                ...userModification
            }
        });
        console.log(`updated user : ${updateUser}`)
        const userCopy = Object.assign({}, updateUser);
        delete userCopy.password;
        delete userCopy.confirmPassword;
        // returned updated user profile (without the password)
        return userCopy;
    } catch(err) {
        throw err
    }
}

async function initUsers(){
    const userCount = await getUserCount();
    console.log(`initiating users in the Database...`)
    if((typeof userCount == "undefined" || userCount == 0)){
        for (let i = 0; i < defaultUsers.user_list.length; i++) { 
            await addUser(defaultUsers.user_list[i]);
        }
        console.log(`initiated users in the Database`)
    }
    else {
        console.log(`you already have users in the database`)
    }
}

async function getUserCount(){
    const prisma = new PrismaClient({});
    const userCount = await prisma.user.count();
    return userCount;
}

async function getUserByUsername (username) {
    // ne pas enlever le mot de passe ici avant de retourner le user
    const prisma = new PrismaClient({});
    return await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
}

async function getUserById (id) {
    const prisma = new PrismaClient({});
    console.log(`getting user by ID in db_userQueries service...`);
    // ne pas enlever le mot de passe ici avant de retourner le user
    const user = await prisma.user.findUnique({
                    where: {
                        id: Number(id),
                    },
                 });
    console.log(`found user : ${JSON.stringify(user, 2, null)}`);
    return user;
}

async function isUserAdmin(userId){
    user = await getUserById(userId);
    return user.isAdmin === 1;
}

async function deleteUser(id){
    const prisma = new PrismaClient({});
    const user = prisma.user.delete({
        where: {
            id: Number(id),
        },
    });
    return user;
}

async function softDeleteUser(userId){
    const user = await deleteUser(userId);
    userChallengeService.deleteUserChallengeByUserId(userId);
    return user;
}

 
module.exports = {
    addUser,
    udpateUserProfile,
    getUserByUsername,
    getUserById,
    initUsers,
    isUserAdmin,
    softDeleteUser
}