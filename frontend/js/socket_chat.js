var socket = io();

// creamos la variable de prametros para detectar el usuario
var params   =   new URLSearchParams( window.location.search );

// Si no viene el nombre, lo devolvemos a la pagina inicial
if ( !params.has('nombre') ){
    window.location = 'index.html';
    throw new Error('El nombre es necesario') ;
}

// Creamos una variable con el nombre del usuario
var usuario = {
    nombre: params.get('nombre')    
};

// Creamos la conexion con el servidor y traemos los usuarios conectados
socket.on('connect', function() {
    socket.emit( 'entrarChat',  usuario, function( resp ){ 
        console.log( 'Usuarios conectados', resp);
     });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar Cuando se envia un mensaje
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

// Escuchar cambios de usuarios (cuando se conecta o se desconecta )
socket.on( 'listaPersona', function(mensaje) {
    console.log(mensaje);
})

// Mensajes privados
socket.on('mensajePrivado', function( mensaje ){
    console.log("privado ", mensaje );
} );