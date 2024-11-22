import { Router } from 'express';
import passport from 'passport'
import authentication from '../controllers/authLoginControllers.js';

const router = Router()


router.post('/login',authentication.loginUser)

router.post('/logout',authentication.logoutUser)

router.post('/refreshToken',authentication.refreshToken)

//----------------------------------------------------------------------------------------------------------
//Ruta para iniciar sesion con Google

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  });


router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }
    res.json({
      message: 'Perfil del usuario',
      user: req.user  // Passport guarda la información del usuario en req.user
    });
  });

router.get('/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  });

//--------------------------------------------------------------------------------------------------


// Ruta para iniciar la autenticación con Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Ruta de callback después de la autenticación
router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

//-------------------------------------------------------------------------------------------------------------------------------

// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback después de autenticarse con GitHub
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Redirige a la página de perfil o a donde desees después de la autenticación
    res.redirect('/profile');
  }
);

//---------------------------------------------------------------------------------------


 
// Ruta para iniciar sesión con Twitter
router.get('/twitter', passport.authenticate('twitter'));

// Ruta de callback de Twitter
router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    // Redirige al usuario a su perfil o a donde necesites
    res.redirect('/profile');
  }
);




  export default router;