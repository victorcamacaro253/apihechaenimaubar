import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/userModels.js';
import { query as _query,pool } from '../db/db1.js';
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de instalar dotenv con `npm install dotenv`


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        // Verificar si el usuario ya existe en la base de datos usando google_id
        let rows = await UserModel.findUserByGoogleId(profile.id);
        console.log(rows)
        // Verificar si `rows` está definido y si es un array
        if (rows) {
            // Si el usuario ya existe, devolver el usuario encontrado
            console.log('El usuario ya existe:', rows);
            return done(null, rows);
        } else {
            // Si el usuario no existe, se crea uno nuevo
            const newUser = {
                google_id: profile.id,
                nombre: profile.displayName,
                correo: profile.emails[0].value,
                imagen: profile.photos[0].value
            };

            console.log('Creando un nuevo usuario:', newUser);

            // Agregar el usuario nuevo a la base de datos
            const createdUser = await UserModel.addUserGoogle(newUser);

            // Retornar el usuario recién creado
            return done(null, createdUser);
        }
    } catch (error) {
        // Manejo de errores en caso de que ocurra un problema
        return done(error, null);
    }
}


));

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser(async (user, done) => {
  try {
      done(null, user);
   
  } catch (err) {
    done(err, null);
  }
});