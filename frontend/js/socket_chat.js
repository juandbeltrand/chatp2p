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
        
        // console.log( 'Usuarios conectados', resp);
        
        // Renderizamos los usuarios conectados y lo mostramos en el panel de la izquierda
        renderizarUsuarios(resp);

        respuestasAutomaticas( 'Bienvenido(a), por favor ingresa el monto a convertir sin puntos ni caracteres especiales' );
        
     });
});

// escuchar cuando se desconecta
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Escuchar Cuando se envia un mensaje a todas las personas
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
    renderizarMensajes( mensaje, false );
    scrollBottom();
});

// Escuchar cambios de usuarios (cuando se conecta o se desconecta )
socket.on( 'listaPersona', function(personas) {
    console.log( "mensaje 49 => ",  personas);
    // Renderizamos los usuarios conectados
    renderizarUsuarios(personas);
})

// Mensajes privados
socket.on('mensajePrivado', function( mensaje ){
    console.log('eeeee');
    // console.log("privado ", mensaje );
} );