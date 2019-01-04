//van solo las urls donde los usuarios pueden crar/elminiar/etc las notas

const express = require('express');
const router = express.Router();

const Note = require('../models/Notes');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/add-note')
});

router.post('/notes/add-note', isAuthenticated, async(req, res) => {
    // console.log(req.body);
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Por favor inserte un titulo' });
    }
    if (!description) {
        errors.push({ text: 'Por favor inserte una descripción' });
    }
    if (errors.length > 0) {
        res.render('notes/add-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Nota guardada correctamente');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async(req, res) => {
    const notes = await Note.find({ user: req.user.id }).sort({ date: 'desc' });
    res.render('notes/all-notes', { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async(req, res) => {
    const note = await Note.findById(req.params.id)
    res.render('notes/edit-note', { note });
});

router.put('/notes/edit-note/:id', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Nota actualizada correctamente');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota eliminada correctamente');
    res.redirect('/notes');
});

module.exports = router;