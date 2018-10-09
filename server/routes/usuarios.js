const express = require('express')
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/users')


app.get('/usuario', function(req, res) {
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5
    Usuario.find({ "estado": true }, 'role estado google nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({}, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    usuarios,
                    cantidadRegistro: conteo
                });
            })

        })
})

app.post('/usuario', function(req, res) {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

/* app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err || !usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: err ? err : { "message": "No hay pelafustan" }
            });
        }
        res.json({
            ok: true,
            usuarioBorrado
        });

    });
}) */

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

module.exports = { app };