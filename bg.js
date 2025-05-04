{
  let run = async (a, b) => {
    let tabId = (b ??= a).id;
    let target = { tabId };
    try {
      chrome.action.disable(tabId);
      chrome.debugger.attach(target, "1.3");
      chrome.debugger.sendCommand(target, "Emulation.setScrollbarsHidden", { hidden: !0 });
      let { result } = (await chrome.userScripts.execute({
        target,
        js: [{ code:
`(async () => await new Promise(resolve => {
  let d = document;
  let root = d.scrollingElement || d.documentElement;
  let bg = d.createElement("b");
  let x = root.scrollLeft;
  let y = root.scrollTop;
  let width = innerWidth;
  let height = innerHeight;
  let scale = devicePixelRatio;
  let rect;

  bg.innerHTML = "<input value=" + scale + " type=number min=.25 max=5 step=.25 style='all:unset;position:fixed;z-index:2147483647;right:144px;top:0;width:48px;font:12px/3 fantasy;border-radius:2px;background:#fff;color:#000;text-align:center;cursor:default'><p style='all:unset;position:fixed;z-index:2147483647;right:80px;top:0;padding:0 8px;border-radius:2px;background:#0ef;font:12px/3 fantasy;color:#000;cursor:pointer'>Save Full</p><p style='all:unset;position:fixed;z-index:2147483647;right:0;top:0;padding:0 8px;border-radius:2px;background:#9f0;font:12px/3 fantasy;color:#000;cursor:pointer'>Save Visible"

  let scaleBtn = bg.firstChild;
  let saveFullBtn = scaleBtn.nextSibling;
  let saveVisibleBtn = bg.lastChild;

  scaleBtn.addEventListener("click", e =>
    e.stopImmediatePropagation(scale = +scaleBtn.value),
    1
  );
  saveFullBtn.onclick = () => bg.remove(resolve({
    captureBeyondViewport: !0
  }));
  saveVisibleBtn.onclick = () => bg.remove(resolve({
    captureBeyondViewport: !0,
    clip: { x, y, width, height, scale }
  }));
  bg.addEventListener("click", e => {
    if (e.target == bg) {
      saveVisibleBtn.remove(saveFullBtn.remove(scaleBtn.remove()));
      root.appendChild(rect = d.createElement("b")).setAttribute("style",
        "width:0;height:0;left:0;top:0;position:absolute;z-index:2147483647;box-sizing:border-box;border:1px dashed #fff;backdrop-filter:brightness(1.2);cursor:crosshair"
      );
      let { scrollLeft, scrollTop } = root;
      let bcr = rect.getBoundingClientRect();
      let px = CSS.px(0);
      let rectStyleMap = rect.attributeStyleMap;
      let mousemoveHandler = e => (
        rectStyleMap.set("width", ((px.value = (width = e.pageX - x) > 0 ? width : width = 1), px)),
        rectStyleMap.set("height", ((px.value = (height = e.pageY - y) > 0 ? height : height = 1), px))
      );
      let scrollHandler = () => (
        rectStyleMap.set("width", ((px.value = (width = width - scrollLeft + (scrollLeft = root.scrollLeft)) > 0 ? width : width = 1), px)),
        rectStyleMap.set("height", ((px.value = (height = height - scrollTop + (scrollTop = root.scrollTop)) > 0 ? height : height = 1), px))
      );

      rectStyleMap.set("left", (px.value = (x = e.pageX) - bcr.x - scrollLeft, px));
      rectStyleMap.set("top", (px.value = (y = e.pageY) - bcr.y - scrollTop, px));

      rect.addEventListener("mousemove", mousemoveHandler);
      bg.addEventListener("mousemove", mousemoveHandler);
      bg.addEventListener("click", () => resolve({
        captureBeyondViewport: !rect.remove(bg.remove(removeEventListener("scroll", scrollHandler))),
        clip: { x, y, width, height, scale }
      }), { once: !0 });
      addEventListener("scroll", scrollHandler);
    }
  }, { once: !0 });
  bg.addEventListener("contextmenu", e =>
    resolve(bg.remove(e.stopImmediatePropagation(rect?.remove()))),
    1
  );
  root.appendChild(bg).setAttribute("style",
    "all:unset;position:fixed;inset:0;z-index:2147483646;width:100%;height:100%;backdrop-filter:brightness(.8);cursor:crosshair"
  );
}))();`
        }]
      }))[0];
      if (result) {
          let crx = await chrome.management.getAll();
          chrome.downloads.download({
            url: "data:image/png;base64," + (await chrome.debugger.sendCommand(target, "Page.captureScreenshot", result)).data,
            filename: b.url.replace(/^.*?:\/\//, "").replace(/\/$/, "").replace(/[|?":/<>*\\]/g, "_") + ".png",
            saveAs: !0
          }, (crx = crx.find(v => v.name == "fformat")) && (
            chrome.management.setEnabled(crx = crx.id, !1),
            () => chrome.management.setEnabled(crx, !0)
          ));
      }
    } catch (e) {}
    chrome.action.enable(tabId).catch(() => 0);
    chrome.debugger.detach(target).then(() => chrome.debugger.sendCommand(target, "Emulation.setScrollbarsHidden", { hidden: !1 })).catch(() => 0);
  }
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
  chrome.commands.onCommand.addListener(run);
}
chrome.runtime.onInstalled.addListener(() => (
  chrome.userScripts.configureWorld({
    messaging: !0
  }),
  chrome.contextMenus.create({
    id: "",
    title: "Take Screenshot",
    contexts: ["page", "frame", "link", "editable", "image", "video"],
    documentUrlPatterns: ["https://*/*", "http://*/*", "file://*"]
  })
));