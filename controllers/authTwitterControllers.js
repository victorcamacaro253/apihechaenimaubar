import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import UserModel from '../models/userModels.js';

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://localhost:3000/auth/twitter/callback',
    includeEmail: true // Incluye el email en la respuesta
  },
  async (token, tokenSecret, profile, done) => {
    try {
      // Verifica si el usuario ya existe
      let user = await UserModel.findUserByTwitterId(profile.id);
      
      if (user) {
        // Si el usuario ya existe, lo devuelve
        return done(null, user);
      } else {
        // Si el usuario no existe, lo crea
        const newUser = {
          twitter_id: profile.id,
          nombre: profile.displayName,
          correo: profile.emails ? profile.emails[0].value : null, // Verifica si hay un email
          imagen: profile.photos[0].value
        };

        user = await UserModel.addUserTwitter(newUser);
        return done(null, user);
      }
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id); // Almacena el ID del usuario
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.getUserById(id); // Recupera el usuario por ID
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
