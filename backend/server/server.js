// Importamos las dependencias
const express       = require('express');
const socketIO      = require('socket.io');
const http          = require('http');
// const cors          = require('cors');
// const body_parser   = require('body-parser');

const path = require('path');

// creamos la variable con express
const app = express();
let server = http.createServer(app);

// Incluimos los cors
// app.use(cors());

// archivo html
const publicPath = path.resolve(__dirname, '../../frontend');

// variable de entorno
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
app.use(express.json({ limit: '1550mb' }));

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);
require('./sockets/socket');

// API que recibe los requerimientos del cambio
app.post('/api/almacenarConversion', (req, res) => {
    console.log('req => ', req.body );
    res.status(200).json({
        sms: "Se procede a almacenar en la base de datos....."        
    })
});

server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});