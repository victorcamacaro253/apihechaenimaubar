import { Router } from 'express';
import passport from 'passport'

const router = Router()

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
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
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Ruta de callback después de la autenticación
router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

//-------------------------------------------------------------------------------------------------------------------------------

// Ruta para iniciar sesión con GitHub
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback después de autenticarse con GitHub
router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Redirige a la página de perfil o a donde desees después de la autenticación
    res.redirect('/profile');
  }
);

//---------------------------------------------------------------------------------------


 
// Ruta para iniciar sesión con Twitter
router.get('/auth/twitter', passport.authenticate('twitter'));

// Ruta de callback de Twitter
router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    // Redirige al usuario a su perfil o a donde necesites
    res.redirect('/profile');
  }
);




  export default router;