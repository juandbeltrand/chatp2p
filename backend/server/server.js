// Importamos las dependencias
const express       = require('express');
const socketIO      = require('socket.io');
const http          = require('http');

const path = require('path');

// creamos la variable con express
const app = express();
let server = http.createServer(app);

// archivo html
const publicPath = path.resolve(__dirname, '../../frontend');

// variable de entorno
const port = process.env.PORT || 3000;

// Conexion con la BD
const connection = require("../database/conexion");

app.use(express.static(publicPath));
app.use(express.json({ limit: '1550mb' }));

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);
require('./sockets/socket');

// API que almacena la interaccion
app.post('/api/almacenarConversion', async (req, res) => {
    
    console.log('req => ', req.body );

    const idUsuario         = req.body.idUsuario;
    const usuario           = req.body.usuario;
    const valorConsultado   = req.body.valorConsultado;
    const origen            = req.body.from;
    const valorConvertido   = req.body.valorConvertido;
    const destino           = req.body.to;
    var mensaje             = '';
    var statusSave          = 400;

    try {
        const results = await new Promise((resolve, reject) => {
            connection.query('INSERT INTO interacciones SET ?', { idUsuario, usuario, valorConsultado, origen, valorConvertido, destino }, (error, results) => {
                if (error) {
                    console.error(error);
                    reject('Error al almacenar en la BD');
                } else {
                    console.log('Registro almacenado con éxito');
                    resolve(results);
                }
            });
        });
        
        mensaje = 'Registro almacenado con éxito';
        statusSave = 200;

    } catch (error) {
        console.error(error);
        mensaje = 'Error al almacenar en la BD';
    }

    res.status(statusSave).json({
        sms: mensaje        
    });

});


server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});