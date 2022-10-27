var express = require('express');
var router = express.Router();

const { Op, QueryTypes } = require("sequelize");
const { sequelize } = require('../models/index');

const moment = require('moment');
const modelo = require("../models/index")
const Horario = modelo.Horario

/**
 * @swagger
 * /horario/createhorario:
 *   post:
 *     description: Registra un nuevo horario verificando que no exista cruce entre los horarios ya programados.
 *     tags:
 *     - horario
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Registrado correctamente.
 *         type: json
 *       401:
 *         description: Error de acceso, debe estar logueado para poder acceder a esta información.
 *         type: json
 *       422:
 *         description: El horario no se ha creado, debe llenar los campos correctamente.
 *         type: json
 *       423:
 *         description: Existe cruce.
 *         type: json
 */
router.post('/createhorario', (req, res) => {
    const { startDate, endDate, rRule, espacio_id } = req.body;

    if (!startDate || !endDate) {
        return res.status(422).json({ error: "por favor, llena los campos" })
    }

    const horario = new Horario({
        endDate,
        startDate,
        rRule : " ",
        espacio_id : 1
    })

    horario.save().then(result => {
        res.status(201).json({ horario: result })
    }).catch(err => {
        console.log(err);
    })
})

/**
 * @swagger
 * /horario/gethorarioespacio:
 *   get:
 *     description: Retorna todos los horarios registrados en el sistema durante un periodo de tiempo.
 *     tags:
 *     - horario
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Horarios retornados correctamente.
 *         type: json
 *       422:
 *         description: El horario no se ha creado, debe llenar los campos correctamente.
 *         type: json
 */
router.get('/gethorarios', (req, res) => {
    Horario.findAll({
        subQuery: false,
        attributes: ["id",
            "endDate",
            "startDate",
            "rRule"],
        include: [
            {
                model: modelo.Grupo,
                through: { attributes: [] },
                attributes: ["grupo"],
                include: {
                    model: modelo.Materia,
                    attributes: ["codigo", "nombre"],
                }
            },
            {
                model: modelo.Espacio,
                attributes: ["nombre"]
            }
        ],
    }
    ).then(horarios => {
        res.status(200).json({ horarios })
    }).catch(err => {
        console.log(err)
    })
})

router.get('/gethorariosfinal', async (req, res) => {
    await sequelize.query(
        "SELECT horarios.id,horarios.startDate,horarios.endDate,horarios.rRule,materias.nombre as title,espacios.nombre as notes FROM `horarios` JOIN grupo_horarios ON grupo_horarios.horario_id=horarios.id JOIN grupos ON grupo_horarios.grupo_id=grupos.id JOIN materias ON grupos.materia=materias.id JOIN espacios ON espacios.id=horarios.espacio", {
        type: QueryTypes.SELECT,
        raw: false
    }
    ).then(horario => {

        /*horario.forEach(element => {
            element.startDate = moment(element.startDate).format('DD/MM/YYYY h:mm:ss');
            element.endDate = moment(element.endDate).format('DD/MM/YYYY h:mm:ss');
        });*/

        console.log(horario)
        res.status(200).json({ horario })
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router;