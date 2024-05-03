window.StartSpeaking = function() {

    if (!window.decir) {
        window.decir = new Decir();
    }

    /*
    decir.silencio();

    decir.ahora("Hey");

    decir.en(1,"Hola.");

    decir.cada(60,"¡Concéntrate!");

    decir.a_las(06,00,00,"Mañana");
    decir.a_las(09,00,00,"Media mañana");
    decir.a_las(12,00,00,"Mediodía");
    decir.a_las(18,00,00,"Mediatarde");
    decir.a_las(24,00,00,"Medianoche");

    // setTimeout( () => { decir.silencio(); decir.ahora("Ya pasó una hora.  Adiós."); }, 60 * 60 * 1000);
    // ^^^^^^^ También aborta la alarma del mediodía
    /* */
}

/*

  // Saluda ahora

    decir.ahora("Hola");

  // Avisa en 10 segundos:

    decir.en(10, "Pasaron 10 segundos!");

  // Avisa esto en 2 segundos (lo dice antes que el mensaje de arriba):

    decir.en(2, "Ya pasaron 2 segundos!");

  // Avisa lo siguiente, pero se superpone con la frase anterior
  // (Speech engine ocupada).
  // El try/catch hace que lo reintente durante 60 segundos.
  // Si no lo logra al cabo de ese tiempo, aborta.

    decir.en(2, "Como dije, pasaron 2 segundos!");

  // Esto lo va a repetir cada 5 segundos hasta que lo hagamos callar

    decir.cada(5, "5 segundos más!");

  // Avisa a las 18:30:05:

    decir.a_las(18,30,05,"Son las 6 y media de la tarde, ¡mas 5 segundos!");

  // Lo hacemos callar (borramos los avisos creados antes) y hacemos que se despida.

    setTimeout( () => { decir.silencio(); decir.ahora("Mejor me callo.  Adiós."); }, 20000);


*/


/* Clase Decir, funciona en Chrome */

function Decir() {

  this.intervals = [];
  this.timeouts = [];

  this.decir = function(texto, retry) {
    if( retry > 0 ) {
      retry--;
      try {
        var msg = new SpeechSynthesisUtterance(texto);
        msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.lang == 'es-US'; })[0];
        speechSynthesis.speak(msg);
      } catch (e) {
        let mensaje = setTimeout(()=>this.decir(texto, retry), 1000);
        this.timeouts.push(mensaje);
      }
    }
  };

  this.ahora = function(texto) {
    return this.decir(texto, 60);
  };

  this.en = function(segundos, texto) {
    let mensaje = setTimeout(()=>this.ahora(texto), segundos*1000);
    this.timeouts.push(mensaje);
    return mensaje;
  };

  this.cada = function(segundos, texto) {
    let mensaje = setInterval(()=>this.ahora(texto), segundos*1000);
    this.intervals.push(mensaje);
    return mensaje;
  };

  this.a_las = function(hora, minutos, segundos, texto) {
    // Obtener la fecha y hora actuales
    const now = new Date();

    // Crear una nueva instancia de fecha para la hora de la alerta
    const alertTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hora,
      minutos,
      segundos
    );

    // Calcular la diferencia en milisegundos
    let timeDifference = alertTime.getTime() - now.getTime();

    // Si la diferencia de tiempo es negativa, significa que la hora es para el día siguiente
    if (timeDifference < 0) {
      // Agregar 24 horas en milisegundos
      timeDifference += 24 * 60 * 60 * 1000;
    }

    return this.en(timeDifference/1000, texto);
  }

  this.silencio = function(){
    for (let i = 0; i < this.timeouts.length; i++) {
      clearTimeout(this.timeouts[i]);
    }    
    for (let i = 0; i < this.intervals.length; i++) {
      clearInterval(this.intervals[i]);
    }    
  };

}

window.StartSpeaking();
