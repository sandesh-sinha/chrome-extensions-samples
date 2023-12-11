console.log('This is a popup!');

function takeScreenshot() {
  console.log('taking screenshot');
  chrome.scripting.captureVisibleTab((result) => {
    const imageUrl = result[0].dataUrl;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'screenshot.png';
    link.click();
  });
  return 'empty';
}

function takeSS() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.tabs.captureVisibleTab((screenshotUrl) => {
      console.log(screenshotUrl);
    });
  });
}
document.getElementById('takeScreenshot').addEventListener('click', () => {
  takeSS();
});


function assetID () {
  if (chrome.enterprise) {
    chrome.enterprise.deviceAttributes.getDeviceAssetId(deviceId => {
      console.log(deviceId);
    })
  } else {
    console.log('Not a Chrome Device');
  }
 }

 assetID()

 document.getElementById('printAssetId').addEventListener('click', () => {
  assetID();
});


// setInterval(takeSS, 6000);
