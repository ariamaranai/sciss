{
  let { action, commands, debugger: _debugger, downloads, contextMenus, runtime, scripting, tabs } = chrome;
  let tabId;
  let target;
  onunhandledrejection = e => (
    e && e.preventDefault?.(),
    tabId && (
      action.enable(tabId),
      action.setPopup({ popup: "" }),
      _debugger.sendCommand(target, "Emulation.setScrollbarsHidden", { hidden: !1 }),
      _debugger.detach(target),
      tabId = target = 0
    )
  );
  let f = async (a, b) => (
    action.setPopup({ popup: "popup.htm" }),
    (tabId = (b ||= a).id) < 0 &&
    (tabId = (await tabs.query({ active: !0, currentWindow: !0 }))[0].id),
    action.openPopup(() => {
      scripting.executeScript({
        target,
        files: ["main.js"]
      }, results => {
        let result = results[0].result;
        if (!result)
          return onunhandledrejection();
        _debugger.sendCommand(target, "Page.captureScreenshot", result, e =>
          downloads.download({
            url: "data:image/png;base64," + e.data,
            filename,
            saveAs: !0
          }, onunhandledrejection)
        );
        let filename = b.url;
        let len = filename.length;
        filename = filename.slice(
          filename[0] === "f" ? filename[5] === ":" ? 8 : 7 : 9,
          len - (filename[len - 1] === "/" ? 1 : 0)).replace(/[|?":/<>*\\]/g, "_"
        ) + ".png";
      })
    }),
    action.disable(tabId),
    _debugger.attach(target = { tabId }, "1.3"),
    _debugger.sendCommand(target, "Emulation.setScrollbarsHidden", { hidden: !0 })
  );
  action.onClicked.addListener(f);
  contextMenus.onClicked.addListener(f);
  commands.onCommand.addListener(f);
  runtime.onInstalled.addListener(() =>
    contextMenus.create({
      id: "",
      title: "Take Screenshot",
      contexts: ["page", "frame", "link", "editable", "image", "video"],
      documentUrlPatterns: ["https://*/*", "http://*/*", "file://*"]
    })
  );
}