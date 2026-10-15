chrome.runtime.onConnect.addListener(port => {
  let scaleButton = document.body.firstElementChild;
  onchange = () => port.postMessage([0, scaleButton.value]);
  v.onclick = () => close(port.postMessage([1, scaleButton.value]));
  v.nextSibling.onClick = () => close(port.postMessage([2, scaleButton.value])); 
});