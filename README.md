#DEMO DISPOSITIVOS HID CON WEBHID API DE GOOGLE CHROME

Leer sobre WEBHID básico aquí: https://web.dev/hid/

Requisitos previos para esta demo, se necesitará lo siguiente:

	-BLINKSTICK o BLICK (1) mk2
	-Chrome 78+
	-Visitar ' chrome: // flags / # enable-experimental-web-platform-features ' y activar "Experiment Web Platform Features". Reiniciar Chrome.
 
Esta demo de dispositivos HID ha sido desarrollada en windows 10(también debería servir en ubuntu).
Debe ser lanzada en un servidor HTTPS, para ello podemos lanzar uno de forma local.
En nuestro caso utilizamos ngrok para puentear la conexión HTTP a HTTPS, para ello podemos ver la siguiente guía:
 
 https://www.luciano.im/blog/comparti-tu-localhost-de-forma-segura-con-ngrok-y-localtunnel/

Nota: Si el comando '$ ngrok http 80' da error, probar con 'ngrok http 127.0.0.1:8080 -host-header=127.0.0.1:8080'. 
En este caso abrimos un túnel HTTPS en el puerto 8080 (se puede poner el puerto que desee).

Una vez llegado aquí, bastaría con abrir una terminal en nuestro equipo y lanzar los siguientes comandos cada vez que queramos lanzar la demo:

cd <Ruta relativa donde hemos copiado el ejecutable>
ngrok authtoken <YOUR_AUTH_TOKEN>
ngrok http 127.0.0.1:8080 -host-header=127.0.0.1:8080  // en caso de querer abrirlo en el puerto 8080

Por último copiamos la dirección web https que nos ha generado ngrok, la pegamos en google chrome y ya podemos probar la demo.

#IMPORTANTE
TENER LANZADO NUESTRO SERVIDOR LOCAL (ver archivo server.js) PARA QUE PUEDA CARGAR LA PÁGINA.