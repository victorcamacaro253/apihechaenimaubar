import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/userModels.js';
import { query as _query,pool } from '../db/db1.js';


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
  },
async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar si el usuario ya existe
      const [rows] = await pool.query("SELECT * FROM usuario WHERE google_id = ?", [profile.id]);

      if (rows.length > 0) {
        // Usuario ya existe, continuar
        return done(null, rows[0]);
      } else {
        // Nuevo usuario, insertar en la base de datos
        const result = await pool.query("INSERT INTO usuario (google_id, nombre, correo) VALUES (?, ?, ?)", [
          profile.id, profile.displayName, profile.emails[0].value
        ]);

        const newUser = {
          id: result.insertId,
          google_id: profile.id,
          nombre: profile.displayName,
          correo: profile.emails[0].value
        };

        return done(null, newUser);
      }
    } catch (error) {
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
