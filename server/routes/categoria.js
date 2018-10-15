const express = require('express');
const app = express();
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');

const Categoria = require('../models/category');

// Mostrar todas las categorias
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('tipoCategoria')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count({}, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    categorias,
                    cantidadRegistro: conteo
                });
            })

        })
});

// Mostrar una categoria espeifica
app.get('/categoria/:id', (req, res) => {
    // findById
    Categoria.findById(req.params.id)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count({ "_id": req.params.id }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    categorias,
                    cantidadRegistro: conteo
                });
            })

        })

});

// Crear categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    categoria = new Categoria({
        tipoCategoria: body.categoria,
        descripcion: body.desc,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

// Editar categoria (nombre)
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['tipoCategoria']);

    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {
        if (err || !categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: !categoriaDB ? { message: "Categoria no existente" } : err
            });
        }
        res.json({
            ok: true,
            usuario: categoriaDB,
        })
    })

});

// Eliminar categoria, solo un administrador y token, eliminar no cambiar estado
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err || !categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: err ? err : { "message": "No hay categoria" }
            });
        }
        res.json({
            ok: true,
            categoriaBorrada
        });

    });
});
module.exports = {
    app
}