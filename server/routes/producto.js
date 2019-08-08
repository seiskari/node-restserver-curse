const express = require('express');

let { verificatoken, verificaAdmin_Role } = require('../middlewares/autentication');

let app = express();

let Producto = require('../models/producto');

// =============================
// Obtener productos
// =============================
app.get('/productos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: false,
                productos
            });
        });
});

// =============================
// Obtener un producto por ID
// =============================
app.get('/producto/:id', (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No se pudo encontrar el producto'
                    }
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// =============================
// Buscar productos
// =============================
app.get('/producto/buscar/:termino', verificatoken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: false,
                productos
            });
        });
});


// =============================
// Crear un producto
// =============================
app.post('/producto', verificatoken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
});

// =============================
// Actualizar un producto
// =============================
app.put('/producto/:id', verificatoken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });
});

// =============================
// Borrar un producto
// =============================
app.delete('/producto/:id', verificatoken, (req, res) => {
    let id = req.params.id;
    // actualiza la bandera de estado a false.
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: 'Producto no encontrado'
            });
        }
        res.json({
            ok: true,
            usuario: productoBorrado
        })
    })
});



module.exports = app;