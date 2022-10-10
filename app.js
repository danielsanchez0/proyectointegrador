var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/**
 * rutas
 */
//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var semestreRouter = require('./routes/semestre');
var departamentoRouter = require('./routes/departamento');
var horarioRouter = require('./routes/horario');
var espacioRouter = require('./routes/espacio');
var materiaRouter = require('./routes/materia');
var sedeRouter = require('./routes/sede');

/**
 * Documentación
 */
var docRouter = require("./routes/api/api-docs");

/**
 * setup
 */
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/semestre', semestreRouter);
app.use('/departamento', departamentoRouter);
app.use('/horario', horarioRouter);
app.use('/espacio', espacioRouter);
app.use('/sede', sedeRouter);
app.use('/materia', materiaRouter);

/**
 * Documentación
 */
app.use('/', docRouter);

module.exports = app;