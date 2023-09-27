import passport from "passport";
import local from "passport-local"
import gitHubStrategy from "passport-github2"
import { userModel } from "../dao/models/user.js";
import { createHash, isValidPassword } from '../utils.js'

const admin = {
    first_name: 'Admin',
    last_name: 'Coder',
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123',
    rol: 'admin'
}

const LocalStrategy = local.Strategy;
const GitHubStrategy = gitHubStrategy.Strategy;
export const initializePassport = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        const { first_name, last_name, email } = req.body;
        try {

            if (email === admin.email) {
                console.log('Ya existe cuenta con ese email');
                return done(null, false);
            }

            const exists = await userModel.findOne({ email });
            if (exists) {
                console.log('El usuario ya existe')
                return done(null, false);
            };
            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password)
            };
            let result = await userModel.create(newUser);
            return done(null, result)
        } catch (error) {
            return done('Error al crear el usuario:' + error)
        }
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            let user
            if (username === admin.email && password === admin.password) {
                user = admin
            } else {
                user = await userModel.findOne({ email: username });
            }

            if (!user) {
                console.log("Usuario no encontrado")
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                console.log("Contraseña incorrecta")
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.4bc3b8e167b094fc",
        clientSecret: "770c4d3155d8b1002800deacfb48ba687301865e",
        callBackURL: "http://localhost:8080/api/sessions/githubCallback",
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {

            const emailResponse = await fetch('https://api.github.com/user/emails', {
                method: 'GET',
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'User-Agent': 'TiendaDeRemeras'
                }
            });
    
            if (emailResponse) {
                const emails = await emailResponse.json();
                const primaryEmail = emails.find(email => email.primary);
                
                if (primaryEmail) {
                    profile.email = primaryEmail.email;
                }
            }

            console.log(profile);
            let user = await userModel.findOne({ userName: profile._json.login})
            if (!user) {
                let newUser = { first_name: profile._json.name, last_name: '', email: profile.email, userName: profile._json.login, password: '' }
                let result = await userModel.create(newUser);
                return done(null, result);
            }
            done(null, user)
        } catch (error) {
            return done(error)
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    })
}