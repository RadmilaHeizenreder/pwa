const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()


router.post('/login', async (req, res) => {
    const candidate = await User.findOne({
        email: req.body.email
    })
    if(candidate) {
        //Candidate existiert bereits, dann wird password überprüft
        const passwordResult = bcrypt.compare(req.body.password, candidate.password)
        if(passwordResult) {
            //wenn password true, muss token generiert werden
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, process.env.JWT, {expiresIn: 60*60*3})

            res.status(200).json({
                data: {email: candidate.email},
                token: `Bearer ${token}`
            })
        } else {
            // wenn password false
            res.status(401).json({
                massage: 'Falsche Password'
            })
        }
    } else {
        //Candidate existiert nicht
        res.status(404).json({
            massage: 'User ist nicht gefunden'
        })
    }
})
router.post('/register', async (req, res) => {
    //email, password
    //prüfen, ob email schon existiert
    //generieren schutz für password
    const candidate = await User.findOne({
        email: req.body.email
    })
    if(candidate) {
        // User existiert bereits. Es wird Fehler geworfen
        res.status(409).json({
            message: 'Diese Email existiert bereits.Bitte geben Sie eine andere Email ein'
        })
    } else {
        // User registieren
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(200).json(user)
        } catch (err) {
            res.send('Error', err)
        }
    }
})

module.exports = router
