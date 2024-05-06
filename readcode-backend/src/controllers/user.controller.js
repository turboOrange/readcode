const dbUserQueries = require("../services/db_userQueries.service");

// POST
async function registerUser(req, res, next) {
    try {
        const thisUser = await req.user;
        var isAdmin = false;
        if(typeof thisUser != "undefined" && thisUser?.isAdmin){
            isAdmin = req.body.isAdmin;
        }

        const user = {
            id:0,
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            isAdmin: isAdmin,
        };

        const addedUser = await dbUserQueries.addUser(user);
        res.status(201).json({
            message: addedUser
        })
    } catch (err) {
        console.error(`Erreur lors de registerUser : ${err}`)
        next(err);
    }
}

// GET
async function getUserById(req, res, next) {
    try {
        const id = req.params.id
        console.log(`Inside getUserById, id=${id}`);
        
        if (!id) {
            return res.status(400).json({
                message: "Message d'erreur que le client recoit comme response"
            })
        }

        const user = await dbUserQueries.getUserById(req.body.id);
        res.status(200).json(user);
    } catch (err) {
        console.error(`Erreur lors de getUserById : ${err}`)
        next(err);
    }
}

// PUT
async function updateUserProfile(req, res, next) {
    try {
        // TODO : valider les nouvelles informations du user (ex.: username/email existe deja)
        const currentUser = await req.user;
        const updatedUser= await dbUserQueries.udpateUserProfile(req.body, currentUser);
        res.status(200).json({message : "Profile utilisateur modifie avec succes", user: updatedUser});
    } catch (err) {
        console.error(`Erreur lors de updateUserProfile : ${err}`)
        next(err);
    }
}

// POST
async function authenticateUser(req, res, next) {
    try {
        console.log(`Route: /authentication --> UserController.authenticateUser`);
        const user = await req.user;
        console.log(`${JSON.stringify(user, 2, null)}`)
        res.status(200).json({message: "login success", user: user})
    } catch (err) {
        console.error(`Erreur lors de authenticateUser : ${err}`)
        next(err);
    }
}

// GET
async function checkAuthenticationState(req, res, next) {
    try {
        const user = await req.user;
        const userCopy = Object.assign({}, user);
        delete userCopy.password;
        console.log(`UserController.checkAuthenticationState -> Currently authenticated user : ${JSON.stringify(user, 2, null)}`)
        res.status(200).json( { message: "You're already authenticated", user: userCopy})
    } catch (err) {
        console.error(`Erreur lors de checkAuthenticationState : ${err}`)
        next(err);
    }
}

// GET
async function isAdmin(req, res, next){
    try {
        const user = await req.user;
        res.status(200).json(user.isAdmin);
    } catch(err){
        console.error(`Erreur lors de isAdmin : ${err}`)
        next(err);
    }
}

// GET
async function deleteUser(req, res, next){
    try {
        const user = await req.user;

        if(user.isAdmin === 1){
            const id = req.params.id
            
            if (!id) {
                return res.status(400).json({
                    message: `Missing ID`
                })
            }
    
            const user = await dbUserQueries.softDeleteUser(req.params.id);
            res.status(200).json(user);
        }else{
            return res.status(400).json({
                message: `Not admin`
            })
        }

    } catch(err){
        console.error(`Erreur lors de deleteUser : ${err}`)
        next(err);
    }
}


module.exports = {
    registerUser,
    getUserById,
    authenticateUser,
    checkAuthenticationState,
    updateUserProfile,
    deleteUser,
    isAdmin,
};
  