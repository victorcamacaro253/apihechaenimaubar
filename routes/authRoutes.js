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

  export default router;