
// creamos la variable de prametros para detectar el usuario
var params   =   new URLSearchParams( window.location.search );

var nombre = params.get('nombre');
var idUsuario = '';
var from,to, mensajeAutomatico;

// Referencias del html
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

var datos_convertir     =   [{ "valor" : "", "origen":"" }];
var consecutivo         =   1;

var mensajeRecibido =   ''

// Funciones de renderizado
function renderizarUsuarios( personas ){

    idUsuario   =   personas[0].id;
    var html    = '';
    
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Conversor de Divisas</span></a>';
    html += '</li>';

    for ( var i = 0; i < personas.length; i++ ){
        html += '<li>';
        html += '    <a data-id="'+personas[i].id+'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> '+ personas[i].nombre +' <small class="text-success">online</small></span></a>';
        html += '</li>';
    };

    divUsuarios.html( html );    
}

// Obtenemos el id del usuario que se escoja
divUsuarios.on('click', 'a', function(){
    var id = $(this).data('id')

    if( id ){
        console.log("id ", id);
    }    
});

// Eventos cuando se envia el mensaje
formEnviar.on('submit', function(e){

    // Evitamos que se recargue la pagina al enviar el mensaje
    e.preventDefault();

    mensajeRecibido = txtMensaje.val();

    if( mensajeRecibido.trim().length === 0  ){
        return;
    }

    // Mensaje que envia el usuario
    socket.emit('mensajePrivado', {
        nombre  :     nombre,
        mensaje :     mensajeRecibido
    }, function( mensaje ) {

        // limpiamos el input
        txtMensaje.val('').focus();
        renderizarMensajes( mensaje, true )
        scrollBottom();
    });

    // Validamos los mensajes de entrada
    validadoresMensajes()

});

function renderizarMensajes( mensaje, yo ){

    var html    =   '';
    var fecha   =   new Date(mensaje.fecha);
    var hora    =   fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if ( mensaje.nombre === 'admin' ){
        adminClass = 'danger';
    }

    if ( yo ){

        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+mensaje.nombre+'</h5>';
        html += '        <div class="box bg-light-inverse">'+mensaje.mensaje+'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+hora+'</div>';
        html += '</li>';

    }else{
        html += '<li class="animated fadeIn" >';

        if ( mensaje.nombre !== 'admin' ){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '    <div class="chat-content">';
        html += '        <h5>'+mensaje.nombre+'</h5>';
        html += '        <div class="box bg-light-'+adminClass+'">'+mensaje.mensaje+'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+hora+'</div>';
        html += '</li>';
    }

    divChatbox.append(html)
}

// Funcion de scroll
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

function respuestasAutomaticas( mensaje ){

    socket.emit('mensajePrivado', {
        nombre  :     'Administrador',
        mensaje :     mensaje
    }, function( mensaje ) {

        // limpiamos el input        
        renderizarMensajes( mensaje, false )
        scrollBottom();
        
    });

}

function validadoresMensajes(){

    if (consecutivo === 1){

        if ($.isNumeric(mensajeRecibido)){
            datos_convertir[0].valor = mensajeRecibido;
            mensajeAutomatico =   'Por favor ingresa: <br> 1. Para convertir de Dolares a Pesos <br> 2. Para convertir de Pesos a Dolares'
            
        }else{
            mensajeAutomatico   = 'Debes ingresar un valor numerico <br> Por favor ingresa el monto a convertir';
            consecutivo         =  0;
        }

        respuestasAutomaticas( mensajeAutomatico )

    }else{

        var continuaProceso = true;
        
        if(mensajeRecibido === 1 || mensajeRecibido === '1'){
            from    =   'USD';
            to      =   'COP';            
        }else if(mensajeRecibido === 2 || mensajeRecibido === '2'){
            from  =   'COP';
            to    =   'USD';
        }else{
            continuaProceso = false;
        }

        if (continuaProceso){

            datos_convertir[0].origen = from;
    
            mensajeAutomatico =   'Un momento por favor....'
            respuestasAutomaticas( mensajeAutomatico )
    
            consecutivo = 0;
    
            // Consumimos API de conversion
            var settings = {
                "url": "https://api.apilayer.com/exchangerates_data/convert?to="+to+"&from="+from+"&amount="+datos_convertir[0].valor,
                "method": "GET",
                "timeout": 0,
                "headers": {
                  "apikey": "SO9nJv9lIR8TsGFkIE6lH93uQdbr7z43"
                },
              };
              
              $.ajax(settings).done(function (response, textStatus, xhr) {
                
                if (response.success === true){
    
                    // console.log("response = ", response);
                    // console.log("datos_convertir == ", datos_convertir);
                    
                    mensajeAutomatico = ''+datos_convertir[0].valor+' '+from+' equivalen a '+response.result+' '+to+'<br> Por favor ingresa el nuevo monto a convertir sin puntos ni caracteres especiales';                
                    respuestasAutomaticas( mensajeAutomatico );

                    // Almacenamos el registro en la bd
                    almacenarBD(  datos_convertir[0].valor,  response.result  );
    
                }else{
                    mensajeAutomatico = 'Se presento un inconveniente al convertir el monto ingresado, por favor intente nuevamente'
                }
    
                }).fail(function(xhr, textStatus, errorThrown) {
                // Se produjo un error en la solicitud
                console.error("Error en la solicitud:", errorThrown);
                mensajeAutomatico = 'Se produjo un error al procesar la solicitud, por favor inténtelo nuevamente';
                respuestasAutomaticas( mensajeAutomatico )
                });        
        }else{
            mensajeAutomatico = 'Por favor ingresa una opcion valida <br> 1. Para convertir de Dolares a Pesos <br> 2. Para convertir de Pesos a Dolares';
            respuestasAutomaticas( mensajeAutomatico )
            consecutivo = 1;
        }
    }    
    consecutivo += 1;
}

function almacenarBD( valorConsultado, valorConvertido ){

    var settings = {
        "url": "http://localhost:3000/api/almacenarConversion",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          idUsuario,
          usuario : usuario.nombre,
          valorConsultado,
          from,
          valorConvertido,
          to
        }),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });

}