const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/users');

const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// configuracion google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        picture: payload.picture,
        google: true,

    }
};

app.post('/google', async function(req, res) {
    let token = req.body.token;
    let googleUser = await verify(token)
        .catch((err) => {
            return res.status(403).json({
                ok: false,
                err
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: err ? err : { "message": "Usted ya se encuentra registrado." }
                });
            } else {
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            let usuario = Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.picture;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(409).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
})

module.exports = { app };