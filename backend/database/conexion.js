const mysql = require('mysql');

const connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '12345678',
    database: 'chat'
 });

 connection.connect(( error )=>{
    if( error ){
        console.log('El error en la conexion es: '+error);
        return;
    }
    console.log('Conectado a la BD!!!');
 });
 module.exports = connection;