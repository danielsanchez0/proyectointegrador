var express = require('express');
var router = express.Router();

const modelo = require("../models/index")
const Sede = modelo.Sede

router.post('/createsede', (req, res) => {
    const { bloque, nombre, descripcion } = req.body;

    if (!bloque || !nombre || !descripcion) {
        return res.status(422).json({ error: "por favor, llena todos los campos" })
    }

    Sede.findOne({
        where: {
            bloque: bloque
        }
    }).then(data => {
        if (data) {
            return res.status(422).json({ error: "ya esta registrada esta sede" })
        }

        const sede = new Sede({
            bloque,
            nombre,
            descripcion
        })

        sede.save().then(result => {
            res.status(201).json({ sede: result })
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)
    })
})

router.get("/getespacios", (req, res) => {
    const { sede_id } = req.body

    Sede.findAll({
        where: {
            id: sede_id
        },
        attributes: ["id","nombre","bloque","descripcion"],
        include: [{
            model: modelo.Espacio,
            attributes: ["id","nombre","descripcion","capacidad"],
            include: [
                {
                    model: modelo.espacio_tipo,
                    attributes: ["id","nombre"]
                }
            ]
        }]
    }).then(espacios => {
        res.status(201).json({ sede: espacios })
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router;