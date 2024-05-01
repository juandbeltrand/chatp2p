
// creamos la variable de prametros para detectar el usuario
var params   =   new URLSearchParams( window.location.search );

var nombre = params.get('nombre');

// Referencias del html
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');


// Funciones de renderizado
function renderizarUsuarios( personas ){

    var html = '';

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

    if( txtMensaje.val().trim().length === 0  ){
        return;
    }

    // Enviar el mensaje
    socket.emit('crearMensaje', {
        nombre  :     nombre,
        mensaje :     txtMensaje.val()
    }, function( mensaje ) {

        // limpiamos el input
        txtMensaje.val('').focus();
        renderizarMensajes( mensaje, true )
        scrollBottom();
    });


});

function renderizarMensajes( mensaje, yo ){

    var html    =   '';
    var fecha   =   new Date(mensaje.fecha);
    var hora    =   fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if ( mensaje.nombre === 'admin' ){
        adminClass = 'danger';
    }

    console.log("mensaje.nombre ", mensaje.nombre);

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