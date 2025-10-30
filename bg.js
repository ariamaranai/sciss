{
  let run = async (a, b) => {
    let tabId = (b || a).id;
    tabId < 0 && (tabId = (await chrome.tabs.query({ active: !0, currentWindow: !0 }))[0].id);
    chrome.action.disable(tabId);
    let target = { tabId };
    try {
      await chrome.debugger.attach(target, "1.3");
      chrome.debugger.sendCommand(target, "Emulation.setScrollbarsHidden", { hidden: !0 });
      let result = (await chrome.userScripts.execute({
        target,
        js: [{ file: "main.js" }]
      }))[0].result;
      if (result) {
        let crx = (await chrome.management.getAll()).find(v => v.name == "fformat");
        if (crx) {
          let id = crx.id;
          chrome.management.setEnabled(id, !1);
          let onDownloadsCreated = () => (
            chrome.management.setEnabled(id, !0),
            chrome.downloads.onCreated.removeListener(onDownloadsCreated)
          );
          chrome.downloads.onCreated.addListener(onDownloadsCreated);
        }
        let filename = (b || a).url;
        let len = filename.length;
        chrome.downloads.download({
          url: "data:image/png;base64," + (await chrome.debugger.sendCommand(target, "Page.captureScreenshot", result)).data,
          filename: decodeURIComponent(filename.slice(filename[0] != "f" ? filename[5] ==":" ? 8 : 7 : 9, len - (filename[len - 1] == "/"))).replace(/[|?":/<>*\\]/g, "_") + ".png",
          saveAs: !0
        });
      }
    } catch {}
    chrome.action.enable(tabId).catch(() => 0);
    chrome.debugger.detach(target)
    .then(() => chrome.debugger.sendCommand(target, "Emulation.setScrollbarsHidden", { hidden: !1 }))
    .catch(() => 0);
  }
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
  chrome.commands.onCommand.addListener(run);
}
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "",
    title: "Take Screenshot",
    contexts: ["page", "frame", "link", "editable", "image", "video"],
    documentUrlPatterns: ["https://*/*", "http://*/*", "file://*"]
  })
);