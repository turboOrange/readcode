const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username);
        console.log(`AUTHENTICATING USER`)
        console.log(`username : ${username} password : ${password}`)
        if (user == null) {
            return done(null,false,{message:'Aucun utilisateur trouve'})
        }

        try {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                // login success
                console.log(`Login success in passport service! current : ${JSON.stringify(user,null,2)}`)
                console.log("removing password from returned user...")
                const userCopy = Object.assign({},user);
                delete userCopy.password;
                console.log(`Removed password userCopy ${JSON.stringify(userCopy,null,2)}`);
                return done(null,userCopy)
            } else {
                return done(null,false,{message: 'Wrong credentials'})
            }
        } catch (err) {
            // erreur avec bcrypt
            console.log(`erreur initialize Passport : ${err.message}`)
            return done(err);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user,done) => { console.log("serializing user..."); return done(null,user.id)})
    passport.deserializeUser((id,done) => { console.log(`deserializing user...\nUser_ID=${id}`); return done(null, getUserById(id))})
}

module.exports = initialize