const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/users');

const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    Usuario.findOne({ email }, (err, usuarioDB) => {
        if (err || !usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: err ? err : { "message": "Usuario o contraseña incorrecto" }
            });
        }
        let iguales = bcrypt.compareSync(password, usuarioDB.password)
        if (!iguales) {
            return res.status(400).json({
                ok: false,
                err: err ? err : { "message": "Usuario o contraseña incorrecto" }
            });
        }

        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
        let decode;
        jwt.verify(token, process.env.SEED, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    err
                });
            }

            decode = new Date(decoded.exp * 1000);

        })
        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
            decode
        })
    })


});

module.exports = { app };