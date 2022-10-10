var express = require('express');
var router = express.Router();

const { Op } = require("sequelize");

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
    const { dia, hora_inicio, hora_final, espacio_id } = req.body;
    const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'sábado', 'domingo']

    if (!dias.includes(dia) || !dia) {
        return res.status(422).json({ error: "día no reconocido." })
    }

    if (!hora_inicio || !hora_final || !espacio_id) {
        return res.status(422).json({ error: "por favor, llena los campos" })
    }

    console.log(hora_inicio.split(":"))

    Horario.findOne({
        where: {
            espacio: espacio_id,
            dia: dia,
            [Op.or]: [
                {
                    hora_inicio: { [Op.between]: [hora_inicio, hora_final] }
                },
                {
                    hora_final: {
                        [Op.and]: {
                            [Op.gt]: hora_inicio,
                            [Op.lte]: hora_final
                        }
                    }
                }
            ]
        }
    }).then(data => {
        if (data) {
            return res.status(422).json({ error: "el horario ya esta ocupado." })
        }

        const horario = new Horario({
            dia,
            hora_inicio,
            hora_final,
            espacio: espacio_id
        })

        horario.save().then(result => {
            res.status(201).json({ horario: result })
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)
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
    const { year, month } = req.body;

    if (!year || !month) {
        return res.status(422).json({ error: "Debe ingresar los valores de año y mes" })
    }

    else if (month < 0 && month > 12) {
        return res.status(422).json({ error: "El mes ingresado no es valido" })
    }

    Horario.findAll({
        subQuery: false,
        attributes: ["dia", "hora_inicio", "hora_final"],
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
                attributes: ["id", "nombre"]
            }
        ]
    }).then(horarios => {
        var diasMes = new Date(year, month, 0).getDate();
        var diasSemana = [
            'domingo',
            'lunes',
            'martes',
            'miércoles',
            'jueves',
            'viernes',
            'sábado'
        ];

        for (i in horarios) {
            var horarios_fecha = []
            var fecha = null

            for (var dia = 1; dia <= diasMes; dia++) {
                var indice = new Date(year, month - 1, dia).getDay();

                if (horarios[i].dataValues["dia"] == diasSemana[indice]) {
                    fecha = year + "/" + month + "/" + dia
                    horarios_fecha.push(fecha)
                }
            }

            horarios[i].dataValues["fechas"] = horarios_fecha
        }
        res.status(200).json({ horarios })
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router;