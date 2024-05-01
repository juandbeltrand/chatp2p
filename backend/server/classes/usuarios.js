
// Creamos una clase para controlar los usuarios
class Usuarios {

    // Definimos el constructor para inicializar el arreglo de las personas conectadas
    constructor(){

        this.personas   =   [];
    }

    agregarPersona( id,nombre ){
        
        // Creamos un objeto con los datos de la persona
        let persona = { id, nombre }

        // Se adiciona al arreglo
        this.personas.push( persona );

        return this.personas;
    }

    // Filtrar persona dependiendo del id
    getPersona( id ){
        let persona =   this.personas.filter( persona => persona.id === id)[0];

        return persona;
    }

    // Filtar todas las personas
    getPersonas(){
        return this.personas;
    }

    // Obtener todas las personas en la sala
    getPersonasPorSala( sala ){
        // ...
    }

    // Borrar una persona del chat
    borrarPersona( id ){

        let personaBorrada  =   this.getPersona( id );
        this.personas = this.personas.filter( persona => persona.id != id );

        return personaBorrada;
    }

}

module.exports  = {
    Usuarios
}