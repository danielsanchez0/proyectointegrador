var express = require('express');
var router = express.Router();

const modelo = require("../models/index")
const Materia = modelo.Materia

router.post('/createmateria', (req, res) => {
    const { codigo, nombre, cupos_maximos, departamento_id } = req.body;

    if (!codigo || !nombre || !cupos_maximos || !departamento_id) {
        return res.status(421).json({ error: "por favor, llena todos los campos" })
    }

    Materia.findOne({
        where: {
            codigo: codigo
        }
    }).then(data => {
        if (data) {
            res.status(422).json({ error: "ya existe una materia registrada con este codigo." })
        }

        const materia = new Materia({
            codigo,
            nombre,
            cupos_maximos,
            departamento_id
        })

        materia.save().then(result => {
            res.status(201).json({ materia: result })
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)
    })
})

router.get('/getmismaterias', (req, res) => {
    Materia.findAll({
        include: [{
            model: modelo.Grupo,
            include: [{
                model: modelo.User
            }]
        }]
    }).then(materias => {
        res.status(201).json({ materias })
    })
})


module.exports = router;