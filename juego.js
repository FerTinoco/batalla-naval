window.onload = function() {
  var disparos = document.getElementById("disparador");
  alert("Bienvenido a batalla naval, ingresa tu nombre para comenzar");

  console.log(modelo.numBarcos, vista, controlador.intentos);
  modelo.generarUbicacionBarcos();

  disparos.onclick = function() {
    var inputAcertarTiro = document.getElementById("inputAcertarTiro");
    var acertar = inputAcertarTiro.value; 
    controlador.procesoAciertos(acertar);
    inputAcertarTiro.value = "";
  };

  inputAcertarTiro.onkeypress = function(e) {
    if (e.keyCode === 13) {
      disparos.click();
      return false;
    }
  };
  
};


var vista = {
  mostrarMensaje: function(msj) {
    var mensaje = document.getElementById("mensaje");
    mensaje.innerHTML = msj;
    
  },
  
  mostrarAcierto: function(ubicacion) {
    var celda = document.getElementById(ubicacion);
    celda.setAttribute("class", "acierto");
  
  },
  
  mostrarFallo: function(ubicacion) {
    var celda = document.getElementById(ubicacion);
    celda.setAttribute("class", "fallo");

  },
  
};
var gamertag = [];

// FUNCIONN PARA GUARDAR EL NOMBRE DEL JUGADOR //
function guardar() {
  var nombre = document.getElementById("nombre").value;
  gamertag.push(nombre);
  console.log(gamertag);
  document.getElementById("nombre").value = "";
  alert ("derriba todos los barcos en el menor numero de intentos, suerte " + gamertag);
  if (gamertag.length > 0) {
    document.getElementById("nombre").disabled = true;
  }
}

var modelo = {
  tamañoTablero: 10,
  numBarcos: 4,
  longitudBarco: 3,
  barcosHundidos: 0,
   
  barcos: [{ubicaciones: [0, 0, 0], acertacion:["","",""]},
          {ubicaciones: [0, 0], acertacion:["",""]},
          {ubicaciones: [0, 0, 0], acertacion:["",""]},
          {ubicaciones: [0], acertacion:[""]}],
  
  tiro: function(acertar) {
    for (var i = 0; i < this.numBarcos; i++) {
      var barco = this.barcos[i];
      var index = barco.ubicaciones.indexOf(acertar);
      console.log(index);
      if (index >= 0) {
        barco.acertacion[index] = "acierto";
        vista.mostrarAcierto(acertar);
        vista.mostrarMensaje(gamertag +" has acertado");
        if (this.isSunk(barco)) {
          vista.mostrarMensaje(gamertag + " HUNDISTE UN BARCO!");
          this.barcosHundidos++;
        }
        console.log(barco);
        return true;
      }
    }
    
    vista.mostrarFallo(acertar);
    vista.mostrarMensaje(gamertag + "  has fallado " + controlador.intentos + " veces");
    console.log(barco);
    return false;
  },
  
  isSunk: function(barco) {
    for (var i = 0; i < this.longitudBarco; i++) {
      if (barco.acertacion[i] !== "acierto") {
        return false;
      }
    }
    return true;
  },
  
  generarBarcos: function() {
    var direccion = Math.floor(Math.random() * 2);
    var fila, columna;
    var nuevaUbicacionBarco = [];
    if (direccion) {
      fila = Math.floor(Math.random() * this.tamañoTablero);
      columna = Math.floor(Math.random() * (this.tamañoTablero - (this.longitudBarco + 1)));
    }
    else {
      fila = Math.floor(Math.random() * (this.tamañoTablero - (this.longitudBarco + 1)));
      columna = Math.floor(Math.random() * this.tamañoTablero);
    }
    for (var i = 0; i < this.longitudBarco; i++) {
      if (direccion) {
        nuevaUbicacionBarco.push(fila + "" + (columna + i));
      }
      else {
        nuevaUbicacionBarco.push((fila + i ) + "" + columna);
      } 
    }
    return nuevaUbicacionBarco;
  },
  
  colision: function(ubicaciones) {
    for (var i = 0; i < this.numBarcos; i++) {
      var barco = modelo.barcos[i];
      for (var j = 0; j < ubicaciones.length; j++) {
        if (barco.ubicaciones.indexOf(ubicaciones[j]) >= 0)  {
          return true;
        }
      }
    }
    return false;
  },
  
  generarUbicacionBarcos: function() {
    var ubicaciones;

    for (var i = 0; i < this.numBarcos; i++) {
      do {
        ubicaciones = this.generarBarcos();
      } while (this.colision(ubicaciones));
      
      this.barcos[i].ubicaciones = ubicaciones; 
    } 
  }
  
};

var controlador = {
  intentos: 0,
  
  ingresarCoordenada: function(acertar) {
    var letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    if (acertar === null  || acertar.length !== 2) {
      alert("Por favor ingrese una letra y un número EN el tablero!");
    }
    else {
      var firstChar = acertar.charAt(0);
      var fila = letras.indexOf(firstChar);
      var column = acertar.charAt(1);
      if (isNaN(fila) || isNaN(column)) {
        alert("Por favor ingrese una letra y un número DENTRO de el tablero!");
      }
      else if (fila < 0  || fila >= modelo.tamañoTablero || column < 0 || column >= modelo.tamañoTablero) {
        alert("Por favor ingrese una letra y un número DENTRO de el tablero!");
      }
      else {
        return fila + column;
      }
    }
    return null;
  },
  
  procesoAciertos: function(acertar) {
     var ubicacion = this.ingresarCoordenada(acertar);
     if (ubicacion) {
       this.intentos++;
       var acierto = modelo.tiro(ubicacion);
       if (acierto && modelo.barcosHundidos === modelo.numBarcos) {
         vista.mostrarMensaje("el jugador"+ gamertag + "ha hundido todos mis barcos en " + this.intentos + " intentos");
       }
     }
  }
  
};