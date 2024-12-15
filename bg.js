(chrome => {
  let run = (a, b) => {
    if ((b ??= a).url[0] != "c") {
      let id = b.id;
      let tabId = { tabId: id };
      chrome.action.disable(id);
      chrome.scripting.executeScript({
        target: tabId,
        world: "MAIN",
        func: () =>
          new Promise(resolve => {
            let px = CSS.px(0);
            let root = document.scrollingElement;
            let bg = document.createElement("b");
            let saveFullBtn = bg.cloneNode();
            let saveVisibleBtn = bg.cloneNode();
            let rect = bg.cloneNode();
            let rectStyle = rect.attributeStyleMap;
            let x = 0;
            let y = 0;
            let width = 0;
            let height = 0;
            let scrollLeft = 0;
            let scrollTop = 0;
            let mousemoveHandler = e => (
              rectStyle.set("height",
                ((px.value = (height = e.pageY - y) > 0 ? height : (height = 1)), px)),
              rectStyle.set("width",
                ((px.value = (width = e.pageX - x) > 0 ? width : (width = 1)), px))
            );
            let scrollHandler = () => (
              rectStyle.set("height",
                ((px.value = (height = height - scrollTop + (scrollTop = root.scrollTop)) > 0 ? height : (height = 1)), px)),
              rectStyle.set("width",
                ((px.value = (width = width - scrollLeft + (scrollLeft = root.scrollLeft)) > 0 ? width : (width = 1)), px))
            );
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
                clip: {
                  x: root.scrollLeft,
                  y: root.scrollTop,
                  width: innerWidth,
                  height: innerHeight,
                  scale: devicePixelRatio
                }
              })
            );
            bg.addEventListener("click", e => { 
              if (e.target == bg) {
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
                addEventListener("mousemove", mousemoveHandler),
                bg.addEventListener("click", () => (
                  bg.remove(),
                  rect.remove(),
                  removeEventListener("mousemove", mousemoveHandler),
                  removeEventListener("scroll", scrollHandler),
                  resolve({
                    captureBeyondViewport: !0,
                    clip: {
                      x,
                      y,
                      width,
                      height,
                      scale: devicePixelRatio
                    }
                  })
                ), { once: !0 });
              }
            }, { once: !0 });
            addEventListener("scroll", scrollHandler);
            bg.oncontextmenu = () => (
              bg.remove(),
              rect.remove(),
              resolve()
            );
          }),
      }, async results => {
        chrome.action.enable(id);
        if (results &&= results[0].result) {
          chrome.debugger.attach(tabId, "1.3");
          let url = "data:image/png;base64," +
                    (await chrome.debugger.sendCommand(tabId, "Page.captureScreenshot", results)).data;
          let filename =  b.url.replace(/^.*?:\/\//, "").replace(/[|?":/<>*\\]/g, "_") + ".png";
          let crxs = await chrome.management.getAll();
          let crx = crxs.find(v => v.name == "file.format");
          crx && crx.enabled
            ? await chrome.management.setEnabled((crx = crx.id), !1)
            : (crx = 0);
          await chrome.downloads.download({url, filename});
          chrome.debugger.detach(tabId);
          crx && chrome.management.setEnabled(crx, !0);
        }
      });
    }
  };
  chrome.action.onClicked.addListener(run);
  chrome.contextMenus.onClicked.addListener(run);
  chrome.commands.onCommand.addListener(run);
  chrome.runtime.onInstalled.addListener(() =>
    chrome.contextMenus.create({
      id: "",
      title: "Take Screenshot",
      contexts: ["all"],
    })
  );
})(chrome);