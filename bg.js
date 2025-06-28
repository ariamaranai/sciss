{
  let run = async (a, b) => {
    let tabId = (b ??= a).id;
    tabId < 0 && (tabId = (await chrome.tabs.query({ active: !0, currentWindow: !0 }))[0].id);
    chrome.action.disable(tabId);
    let target = { tabId };
    try {
      await chrome.debugger.attach(target, "1.3");
      chrome.debugger.sendCommand(target, "Emulation.setScrollbarsHidden", { hidden: !0 });
      let { result } = (await chrome.userScripts.execute({
        target,
        js: [{ file: "main.js" }]
      }))[0];
      if (result) {
        let crx = await chrome.management.getAll();
        if (crx = crx.find(v => v.name == "fformat")) {
          let f = () => (
            chrome.management.setEnabled(crx, !0),
            chrome.downloads.onCreated.removeListener(f)
          );
          chrome.management.setEnabled(crx = crx.id, !1);
          chrome.downloads.onCreated.addListener(f);
        }
        let filename = b.url;
        let len = filename.length;
        filename = decodeURIComponent(filename.slice(filename[0] != "f" ? filename[5] ==":" ? 8 : 7 : 9, len - (filename[len -1] == "/"))).replace(/[|?":/<>*\\]/g, "_") + ".png";
        chrome.downloads.download({
          url: "data:image/png;base64," + (await chrome.debugger.sendCommand(target, "Page.captureScreenshot", result)).data,
          filename,
          saveAs: !0
        });
      }
    } catch {}
    chrome.action.enable(tabId).catch(() => 0);
    chrome.debugger.detach(target).then(() => chrome.debugger.sendCommand(target, "Emulation.setScrollbarsHidden", { hidden: !1 })).catch(() => 0);
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