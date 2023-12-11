const SCREENSHOT_INTERVAL = 6000;
let screenshotSrc;
let screenshotInteval;
let uniqueId;

function setUniqueId () {
  // if (chrome.enterprise) {
  //   chrome.enterprise.deviceAttributes.getDeviceSerialNumber(deviceSerialNumber => {
  //     uniqueId = deviceSerialNumber
  //   })
  // } else {
  //   console.log('Not a chrome device');
  // }
  return '0000';
}

setUniqueId()

if(screenshotInteval) {
  clearInterval(screenshotInteval);
}

function takeScreenshot() {
  chrome.tabs.captureVisibleTab((screenshotUrl) => {
    console.log('this is screenshot', screenshotUrl);
    screenshotSrc = screenshotUrl;
  });
}

screenshotInteval = setInterval(takeScreenshot, SCREENSHOT_INTERVAL);

function getUniqueId() {
  return uniqueId || '0000-0000-0000';
}

function onError(err) {
  console.log(err);
}

// function sendMessageToActiveTab(type, data) {
//   chrome.tabs.query({
//     currentWindow: true,
//     active: true,
//   }).then((tabs) => {
//     for (const tab of tabs) {
//       if (tab.url !== 'http://localhost/content/dam/universal-player/firmware.html') continue;
//       chrome.tabs
//         .sendMessage(tab.id, { type, ...data })
//         .then((response) => {
//           console.log(`Response message from client ${response.response}`);
//         })
//         .catch(onError);
//     }
//   })
// }


chrome.runtime.onMessage.addListener(
  function(request, _sender, sendResponse) {
    console.log('message received from', _sender);
    if (request.type === 'uniqueId') {
      sendResponse({ uniqueId: getUniqueId() });
    }
    if (request.type === 'screenshot' && screenshotSrc) {
      sendResponse({ screenshot: screenshotSrc })
    }
  }
);
