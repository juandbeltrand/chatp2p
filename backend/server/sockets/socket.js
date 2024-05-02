// Importamos el IO del socket
const { io } = require('../server');

// Importamos la clase usuario
const { Usuarios } = require('../classes/usuarios')

// Importamos las utilizades
const { crearMensaje }    = require('../utils/utilidades')

const usuarios = new Usuarios();

// Establecemos el tunnel de socket
io.on('connection', (client) => {

    console.log('Usuario conectado');

    // Escuchamos cuando un usuario entre al chat y lo adicionamos a al objeto de la clase de Usuarios
    client.on('entrarChat', (usuario, callback) => {

        if (typeof callback === 'function') {

            // Si no viene el nombre se regresa el mensaje
            if (!usuario.nombre) {
                return callback({
                    error: true,
                    mensaje: 'El nombre es necesario'
                });
            }
            
            // Adicionamos el usuario al objeto
            let personas = usuarios.agregarPersona( client.id, usuario.nombre);

            // Mensaje para mostrar las personas conectadas
            // client.broadcast.emit( 'listaPersona', usuarios.getPersonas() );
            // client.broadcast.emit( 'listaPersona', usuarios.getPersona(client.id) );

            var conectado   =   [];

            conectado.push(personas.filter( persona => persona.id === client.id)[0]);

            
            // Regresamos solamente la persona que esta en este socket
            // callback( personas );
            callback( conectado );
            
        } 
    });   

    // Emitir el mensaje a todos
    client.on('crearMensaje', (data, callback ) =>  {

        let persona = usuarios.getPersona( client.id );

        let mensaje = crearMensaje( persona.nombre, data.mensaje );
        client.broadcast.emit( 'crearMensaje', mensaje );

        callback(mensaje)

    });

    // Escuchamos cuando el usuario de desconecte
    client.on('disconnect', () => {

        // Eliminamos el usuario del objeto
        let personaBorrada = usuarios.borrarPersona( client.id )

        // Se informa a todos los usuarios
        // client.broadcast.emit( 'crearMensaje', crearMensaje( 'admin', `${ personaBorrada.nombre } se desconecto `)  );

        // Mensaje para mostrar las personas conectadas
        // client.broadcast.emit( 'listaPersona', usuarios.getPersonas() );

    }); 

    // Mensaje privado
    client.on('mensajePrivado', (data, callback) => {

        let persona = usuarios.getPersona( client.id );

        let mensaje = crearMensaje( data.nombre, data.mensaje );

        client.broadcast.to(  client.id  ).emit( 'mensajePrivado', mensaje );

        callback(mensaje)

    })

});
