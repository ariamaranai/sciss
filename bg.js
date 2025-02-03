{
  let run = async (a, b) => {
    let url = (b ??= a).url;
    if (url[0] != "c") {
      let tabId = b.id;
      let target = { tabId };
      chrome.action.disable(tabId);
      chrome.scripting.executeScript({
        target,
        world: (await chrome.contentSettings.javascript.get({
          primaryUrl: url
        })).setting == "allow" ? "MAIN" : "ISOLATED",
        func: async () =>
          await new Promise(resolve => {
            let d = document;
            let root = d.scrollingElement;
            let bg = d.createElement("b");
            let saveFullBtn = d.createElement("b");
            let saveVisibleBtn = d.createElement("b");
            let x = root.scrollLeft;
            let y = root.scrollTop;
            let width = innerWidth;
            let height = innerHeight;
            let scrollLeft = 0;
            let scrollTop = 0;
            let scale = devicePixelRatio;
            let rect;
            bg.appendChild(saveFullBtn).setAttribute("style",
              "all:unset;position:fixed;z-index:2147483647;right:76px;top:0;padding:8px;border:1px dashed;background:#0ef;font:12px fantasy;color:#000;cursor:pointer"
            );
            bg.appendChild(saveVisibleBtn).setAttribute("style",
              "all:unset;position:fixed;z-index:2147483647;right:0;top:0;padding:8px;border:1px dashed;background:#9f0;font:12px fantasy;color:#000;cursor:pointer"
            );
            root.appendChild(bg).setAttribute("style",
              "all:unset;position:fixed;inset:0;z-index:2147483646;height:100%;backdrop-filter:brightness(.8);cursor:crosshair"
            );
            saveFullBtn.textContent = "Save Full";
            saveVisibleBtn.textContent = "Save Visible";
            saveFullBtn.onclick = () => (
              bg.remove(),
              resolve({ captureBeyondViewport: !0 })
            );
            saveVisibleBtn.onclick = () => (
              bg.remove(),
              resolve({
                captureBeyondViewport: !0,
                clip: { x, y, width, height, scale }
              })
            );
            bg.addEventListener("click", e => { 
              if (e.target == bg) {
                let px = CSS.px(0);
                let rectStyle = (rect = d.createElement("b")).attributeStyleMap;
                let mousemoveHandler = e => (
                  rectStyle.set("height",
                    ((px.value = (height = e.pageY - y) > 0 ? height : height = 1), px)),
                  rectStyle.set("width",
                    ((px.value = (width = e.pageX - x) > 0 ? width : width = 1), px))
                );
                let scrollHandler = () => (
                  rectStyle.set("height",
                    ((px.value = (height = height - scrollTop + (scrollTop = root.scrollTop)) > 0 ? height : height = 1), px)),
                  rectStyle.set("width",
                    ((px.value = (width = width - scrollLeft + (scrollLeft = root.scrollLeft)) > 0 ? width : width = 1), px))
                );
                scrollLeft = root.scrollLeft;
                scrollTop = root.scrollTop;
                saveFullBtn.remove();
                saveVisibleBtn.remove();
                root.appendChild(rect).setAttribute("style",
                  "height:0;width:0;top:" +
                  (y = e.pageY) +
                  "px;left:" +
                  (x = e.pageX) +
                  "px;position:absolute;z-index:2147483647;border:1px dashed #999;box-sizing:border-box;backdrop-filter:brightness(1.2);cursor:crosshair"
                );
                bg.addEventListener("mousemove", mousemoveHandler),
                rect.addEventListener("mousemove", mousemoveHandler),
                addEventListener("scroll", scrollHandler);
                bg.addEventListener("click", () => (
                  bg.remove(),
                  rect.remove(),
                  removeEventListener("scroll", scrollHandler),
                  resolve({
                    captureBeyondViewport: !0,
                    clip: { x, y, width, height, scale }
                  })
                ), { once: !0 });
              }
            }, { once: !0 });
            addEventListener("contextmenu", e => (
              e.stopImmediatePropagation(),
              bg.remove(),
              rect.remove(),
              resolve()
            ), { once: !0 });
          })
      }, async results => {
        chrome.action.enable(tabId);
        if (results &&= results[0].result) {
          chrome.debugger.attach(target, "1.3");
          let dataUrl = "data:image/png;base64," +
            (await chrome.debugger.sendCommand(target, "Page.captureScreenshot", results)).data;
          let filename =  url.replace(/^.*?:\/\//, "").replace(/\/$/, "").replace(/[|?":/<>*\\]/g, "_") + ".png";
          let crxs = await chrome.management.getAll();
          let crx = crxs.find(v => v.name == "fformat");
          crx && crx.enabled
            ? await chrome.management.setEnabled((crx = crx.id), !1)
            : crx = 0;
          await chrome.downloads.download({ url: dataUrl, filename, saveAs: !0 });
          chrome.debugger.detach(target);
          crx && chrome.management.setEnabled(crx, !0);
        }
      });
    }
  }
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
  chrome.commands.onCommand.addListener(run);
}
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: "",
    title: "Take Screenshot",
    contexts: ["all"],
    documentUrlPatterns: ["https://*/*", "https://*/", "http://*/*", "http://*/", "file://*/*", "file://*/"]
  })
);