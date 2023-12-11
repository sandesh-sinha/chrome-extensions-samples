// Connection port received from client
let communicationPort;
let periodicCommInterval; 


const sendMessageToClient = (message) => {
  if(communicationPort) {
    communicationPort.postMessage(message);
  }
}

const sendMessageToExtension = (type) => {
  return chrome.runtime.sendMessage({ type });
}

const nonPeriodicSync = () => {
  sendMessageToExtension('uniqueId').then((response) => {
    console.log('sending uniqueId to player');
    if (!response.uniqueId) return;
    sendMessageToClient({ type: 'uniqueId', uniqueId: response.uniqueId });
  })
}

const periodicSync = () => {
  sendMessageToExtension('screenshot').then((response) => {
    console.log('sending screenshot to player');
    console.log(response);
    if(!response || !response.screenshot) return;
    sendMessageToClient({ type: 'screenshot', screenshot: response.screenshot });
  });  
}

const startPeriodiceSync = () => {
  if (periodicCommInterval) {
    clearInterval(periodicCommInterval);
  }
  periodicCommInterval = setInterval(periodicSync, 6000);
}

// Establish connection with client
window.addEventListener("message", (event) => {
  if (
    event.source === window &&
    event?.data?.type === "initiateConnection"
  ) {
    communicationPort = event.ports[0];
    console.log('Content script received a port for communication and now will send the relevant data to player at regular interval');
    nonPeriodicSync();
    startPeriodiceSync();
  }
});

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if (communicationPort && request.type === 'playerName' && request.deviceId ) {
//       sendMessageToClient({ type: 'playerName', playerName: request.deviceId });
//       sendResponse({ response: 'playName received' });
//     }
//     if (communicationPort && request.type === 'screenshot' && request.screenshotData ) {
//       sendMessageToClient({ type: 'screenshot', screenshot: request.screenshot });
//       sendResponse( { response: 'received screenshot' });
//     }
//   }
// );