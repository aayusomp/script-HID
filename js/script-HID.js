import { GREEN, OFF, RED } from './colors.js';

const filters = [
  {
    //identificadores de BlinkStick
    vendorId : 0x20A0 ,
    productId : 0x41e5
  },
  {
    // identificadores de Blink(1) mk2
    vendorId : 0x27b8,
    productId : 0x01ed
  }
];

let DEVICE = 0; // 0-> BlinckStick, 1 -> Blink(1) mk2, ponemos por defecto BlinkStick.
let LED_COUNT = 8; // Número de led del dispositivo, ponemos por defecto 8 que son los que tiene BlinkStick.
let simulation = 1; // Utilizaremos esta variable para simular cuando nos llegue una notificacion a la pagina de burguer king de pedido correcto o pedido cancelado. 0 -> Cancelado.  1 -> Correcto
let intermittent = 0; // Utilizaremos esta variable para simular efecto intermitente o fijo. 0 -> Fijo.  1 -> Intermitente.
let running = false; // Bandera para controlar cuando queramos apagar el dispositivo.
let disconnect = false; // Bandera para controlar cuando queramos desconectar el dispositivo.

document.querySelector('#ConnectDevice').addEventListener('click', Connect);
document.querySelector('#DisconnectDevice').addEventListener('click',  () => (disconnect = true, document.getElementById("nom-dispositivo").innerHTML =''));

document.querySelector('#pedido_correcto').addEventListener('click', () => (simulation = 1));
document.querySelector('#pedido_cancelado').addEventListener('click', () => (simulation = 0));

document.querySelector('#start-LuzFija').addEventListener('click',() => (intermittent = 0));
document.querySelector('#start-LuzIntermitente').addEventListener('click', () => (intermittent = 1));

document.querySelector('#start').addEventListener('click', Start );
document.querySelector('#stop').addEventListener('click', () => (running = false));


// Función para conectar un dispositvo HID con WEBHID API de google chrome
async function Connect() {
  const device = await getOpenedDevice();
  return device;
}

// Función para ejecutar la simulación
async function Start() {
  
  const device_list = await navigator.hid.getDevices();
  let i = 0;
  if(DEVICE==1) i=1;
  let device = device_list.find( d => d.vendorId === filters[i].vendorId && d.productId === filters[i].productId );

  if(device){
  if(device.opened ){
    document.getElementById("connect").innerHTML ='';
    running = true;

    await clear(device);

    const effectGenerator = permanent();

  while (running && !disconnect) {
    const action = effectGenerator.next().value;

    if (typeof action === 'number') {
      await wait(action);
    } else if (action.length === 2) {
      const [index, color] = action;
      setColor(device, index, color);
    } else {
      const color = action;

      for (let i = 0; i < LED_COUNT; i++) {
        await setColor(device, i, color);
      }
    }
  }
  await clear(device);
  if(disconnect){
  await device.close();
    device=null;
    console.log("Dispositivo desconectado ");
  }
}else{
  document.getElementById("connect").innerHTML =  "You must do click again in CONECTAR DISPOSITIVO";
}
}else{
  document.getElementById("connect").innerHTML =  "No device recognized";
}
}

// Función para obtener los dispositivos conectados
async function getOpenedDevice() {
  const device_list = await navigator.hid.getDevices();
  console.log(device_list)
  let i = 0;
  if(DEVICE == 1) i = 1;
  let device = device_list.find( d => d.vendorId === filters[i].vendorId && d.productId === filters[i].productId );  
  
  if (!device || disconnect) {
    // ahora nos devulve una matriz
   let devices = await navigator.hid.requestDevice({ filters });
   console.log("Selected device:",devices);
   device = devices[0];
   if( !device ) return null;
  }

  if (device.opened) {
    document.getElementById("nom-dispositivo").innerHTML =  device.productName;
  }else {
    await device.open();
    console.log("Device opened:",device);
    document.getElementById("nom-dispositivo").innerHTML =  device.productName;
      if(disconnect) disconnect = false;
}
  if(device.vendorId == 0x20A0){
   DEVICE = 0; LED_COUNT = 8;
    }else{
      DEVICE = 1; LED_COUNT = 1;
   }
 
  return device;
}

//Función para establecer el color de los leds
async function setColor(device, index, [r, g, b], retries = 1) {
  // Limite el brillo; en algún nivel superior comienza a atascarse (¿sobrecalentamiento?)
  r *= 0.5;
  g *= 0.5;
  b *= 0.5;
  let reportId;;
  let data;
  if(DEVICE == 0){
  //Para BlinkStick. Información obtenida de https://github.com/arvydas/blinkstick-node/blob/master/blinkstick.js#L429
  reportId = 5;
  data = Int8Array.from([reportId, index, r, g, b]);
  }else{
  //Para blink(1) mk2
  reportId = 1;
  data = Uint8Array.from([0x63, r, g, b, 0x00, 0x10, 0x00, 0x00 ]);
  }

  try {
    await device.sendFeatureReport(reportId, data);
  } catch (error) {
    if (retries > 0) {
      await setColor(device, index, [r, g, b], --retries);
    } else {
      console.error(`Failed to set color at index ${index}`, error);
    }
  }
}

//Funcion de espera
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// metodo para apagar los led del dispositivo 
async function clear(device) {
  for (let i = 0; i < LED_COUNT; i++) {
    await setColor(device, i, [0, 0, 0]);
  }
}

function* permanent() {

  const INTERVAL_MS = 500; // tiempo entre luz encendida y luz apagada
  while (true) {
    //simulamos si llega un peiddo correcto o un pedido cancelado
    if(simulation)
    yield GREEN; 
    else
    yield RED; 
  
    //si desea simular luz intermitente
    if(intermittent){
    yield INTERVAL_MS;
    yield OFF;
    yield INTERVAL_MS;
    }
  }
}