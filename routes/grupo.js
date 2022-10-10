var express = require('express');
var router = express.Router();

const modelo = require("../models/index")
const Grupo = modelo.Grupo

router.post('/creategrupo', (req, res) => {
    const { grupo, materia, usuario_id } = req.body;

    if (!grupo || !materia || !usuario_id) {
        return res.status(422).json({ error: "por favor, llena todos los campos" })
    }

    const group = new Grupo({
        grupo,
        materia,
        usuario_id
    })

    group.save().then(result => {
        res.status(201).json({ grupo: result })
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;