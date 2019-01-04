//el usuario va a poder auntenticarse/logearse

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin') //logueo
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup') //registrar
});

router.post('/users/signup', async(req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    console.log(req.body);
    if (name.length <= 0) {
        errors.push({ text: 'Inserte un nombre' })
    }
    if (email.length <= 5) {
        errors.push({ text: 'Inserte un email' })
    }
    if (password != confirm_password) {
        errors.push({ text: 'La contraseña no coinciden ' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe tener al menos 4 caracteres' })
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'El email ya esta en uso');
            res.redirect('/users/signup')
        }
        const newUser = new User({ name, email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', '¡Ya estas registrado!');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;