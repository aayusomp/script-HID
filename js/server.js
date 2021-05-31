// Servidor local en el puerto 8080
// Para lanzar el servidor utilizamos el comando: node server.js
const express = require('express');
const app = express();

const PORT = 8080;

app.use(express.static(__dirname + '/'));

app.listen(PORT, function() {
  console.log('Servidor web escuchando en el puerto '+PORT);
});

