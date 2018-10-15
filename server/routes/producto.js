const express = require('express');
const app = express();
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');

const Producto = require('../models/producto');

// Mostrar todos los productos, paginados
app.get('/productos', (req, res) => {
    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ disponible: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos,
                    cantidadRegistro: conteo
                });
            })

        })
});

// Mostrar un producto espeifico
app.get('/productos/:id', (req, res) => {
    // findById
    Producto.findById(req.params.id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ "_id": req.params.id }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos,
                    cantidadRegistro: conteo
                });
            })

        })

});

// buscar productos

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, "i");
    Producto.find({ nombre: regex })
        .populate('usuario categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ nombre: termino }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos,
                    cantidadRegistro: conteo
                });
            })

        })
})

// Crear productos
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })
});

// Editar Producto 
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ["categoria", "usuario"]);

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err || !productoDB) {
            return res.status(400).json({
                ok: false,
                err: !productoDB ? { message: "Categoria no existente" } : err
            });
        }
        res.json({
            ok: true,
            usuario: productoDB,
        })
    })

});

// Eliminar producto, solo un administrador y token, cambiar estado
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoEliminado: productoDB
        })
    })
});

module.exports = {
    app
}