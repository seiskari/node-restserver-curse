const express = require('express');

let { verificatoken, verificaAdmin_Role } = require('../middlewares/autentication');

let app = express();

let Categoria = require('../models/categoria');
// =============================
// Mostrar todas las categorias
// =============================
app.get('/categoria', verificatoken, (req, res) => {
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No se pudieron encontrar categorias'
                    }
                });
            }
            res.json({
                ok: true,
                categorias
            });
        });
});

// =============================
// Mostrar una categoria por ID
// =============================
app.get('/categoria/:id', verificatoken, (req, res) => {
    // categoria.findbyid() 
    let id = req.params.id;
    categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: 'Categoria no encontrada'
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

// =============================
// Crear una nueva categoria
// =============================
app.post('/categoria', verificatoken, (req, res) => {
    // TODO: regresa la nueva categoria
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
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
                err: {
                    message: 'No se pudo crear la categoria'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// =============================
// Actualiza una categoria
// =============================
app.put('/categoria/:id', verificatoken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }
    Catergoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo actualizar la categoria'
                }
            });
        }
    });
});

// =============================
// Crear una nueva categoria
// =============================
app.delete('/categoria/:id', [verificatoken, verificaAdmin_Role], (req, res) => {
    // TODO: solo un admin puede borrar
    // categoria.findbyidandremove
    let id = req.params.id;
    // lo elimina definitivamente
    categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: 'Categoria no encontrada'
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;