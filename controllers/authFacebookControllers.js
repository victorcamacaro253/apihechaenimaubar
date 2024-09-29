import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import UserModel from '../models/userModels.js';

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos'] // Campos a obtener
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar si el usuario ya existe
      let user = await UserModel.findUserByFacebookId(profile.id);

      if (user) {
        // Usuario ya existe, continuar
        return done(null, user);
      } else {
        // Crear un nuevo usuario
        const newUser = {
          facebook_id: profile.id,
          nombre: profile.displayName,
          correo: profile.emails[0].value,
          imagen: profile.photos[0].value
        };

        user = await UserModel.addUserFacebook(newUser);
        return done(null, user);
      }
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id); // Asumiendo que `user.id` es el identificador único del usuario
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.getUserById(id); // Debes implementar esta función
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
