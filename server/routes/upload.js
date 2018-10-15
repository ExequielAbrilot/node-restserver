const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/users');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options deja todo en req.files
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: "no se a detectado archivo"
        });
    }

    //Valida tipo
    let tiposValidos = ['usuarios', 'productos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.json({
            ok: true,
            err: {
                message: 'No se permite el tipo ' + tipo + '. Los tipos validas son ' + tiposValidos.join(' y ')
            }
        });
    }


    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.')[0];
    let extensionArchivo = archivo.name.split('.')[1];

    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.json({
            ok: true,
            err: {
                message: 'No se permiten archivos ' + extensionArchivo + '. Las extensiones validas son ' + extensionesValidas.join(', ')
            }
        });
    }

    let nombreArchivoSubida = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`

    archivo.mv(`uploads/${tipo}/${nombreArchivoSubida}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivoSubida);
        } else if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivoSubida);
        }
    });

});

function imagenUsuario(id, res, nombreArchivoSubida) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err || !usuarioDB) {
            borraArchivo(nombreArchivoSubida, "usuarios");
            return res.status(500).json({
                ok: false,
                err: !usuarioDB ? { message: "Usuario no existe" } : err
            });
        }

        borraArchivo(usuarioDB.img, "usuarios");

        usuarioDB.img = nombreArchivoSubida;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivoSubida
            })


        })

    })
}

function imagenProducto(id, res, nombreArchivoSubida) {
    Producto.findById(id, (err, productoDB) => {
        if (err || !productoDB) {
            borraArchivo(nombreArchivoSubida, "productos");
            return res.status(500).json({
                ok: false,
                err: !productoDB ? { message: "Producto no existe" } : err
            });
        }

        borraArchivo(productoDB.img, "usuarios");

        productoDB.img = nombreArchivoSubida;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivoSubida
            })


        })

    })
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = {
    app
}