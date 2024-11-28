import passport from 'passport';
import { Strategy as OpenIDConnectStrategy } from 'passport-openidconnect';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

passport.use(
  new OpenIDConnectStrategy(
    {
      issuer: 'https://accounts.google.com', // Proveedor OpenID
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenURL: 'https://oauth2.googleapis.com/token',
      userInfoURL: 'https://openidconnect.googleapis.com/v1/userinfo',
      callbackURL: 'http://localhost:3000/auth/auth/google/callback', // URL de callback de tu aplicación
      scope: ['openid', 'profile', 'email'], // Escopos necesarios para obtener la información del perfil y refresh token
    },
    function verify(issuer, sub, profile, accessToken, refreshToken, cb) {
      // Aquí puedes realizar acciones adicionales como guardar el usuario en la base de datos
      console.log('Issuer:', issuer);
      console.log('Profile:', profile);
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);

      // Retornamos el perfil del usuario junto con los tokens en el callback
      return cb(null, { profile, accessToken, refreshToken }); // El perfil y los tokens como el objeto de autenticación
    }
  )
);

// Serialización y deserialización del usuario
passport.serializeUser ((user, cb) => {
  // Almacenar el ID del usuario en la sesión
  cb(null, user.profile.id); // Asegúrate de que el ID esté disponible en el perfil
});

passport.deserializeUser ((id, cb) => {
  // Recuperar el usuario basado en el ID
  cb(null, { id }); // Aquí puedes buscar el usuario en la base de datos si lo deseas
});