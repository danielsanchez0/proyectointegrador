var express = require('express');
var router = express.Router();

const modelo = require("../models/index")
const Departamento = modelo.Departamento

router.post('/createdepartamento', (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(422).json({ error: "por favor, llena todos los campos" })
    }

    const departamento = new Departamento({
        nombre,
        descripcion
    })

    departamento.save().then(result => {
        res.status(201).json({ semestre: result })
    }).catch(err => {
        console.log(err)
    })
})

router.get('/getmaterias', (req, res) => {
    const { departamento_id } = req.body

    Departamento.findAll({
        where: {
            id: departamento_id
        },
        attributes: ["id","nombre","descripcion"],
        include: [
            {
                model: modelo.Materia,
                attributes: ["id", "codigo", "nombre"],
            }
        ]
    }).then(materias => {
        res.status(201).json({ departamento: materias })
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router;