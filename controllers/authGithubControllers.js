import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import UserModel from '../models/userModels.js';

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback',
    scope: ['user:email'], // Asegúrate de incluir el alcance aquí

  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findUserByGithubId(profile.id);
console.log(profile.email)
      if (user) {
        return done(null, user); // Usuario existe, retorna el usuario
      } else {
        const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;

        // Si el usuario no existe, lo crea
        const newUser = {
          github_id: profile.id,
          nombre: profile.displayName,
          correo: email,
          imagen: profile.photos[0].value,
        };

        user = await UserModel.addUserGithub(newUser);
        return done(null, user);
      }
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id); // Guarda el ID del usuario en la sesión
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
