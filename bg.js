{
  let run = (a, b) => {
    let tabId = (b ??= a).id;
    let target = { tabId };
    chrome.action.disable(tabId);
    chrome.userScripts.execute({
      target,
      js: [{ code:
`(async () => await new Promise(resolve => {
  let d = document;
  let root = d.body || d.documentElement;
  let bg = d.createElement("b");
  let scaleBtn = d.createElement("input");
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

  scaleBtn.type = "number";
  scaleBtn.min = scaleBtn.step = ".25";
  scaleBtn.max = "5";
  scaleBtn.value = scale;
  saveFullBtn.textContent = "Save Full";
  saveVisibleBtn.textContent = "Save Visible";

  scaleBtn.addEventListener("click", e =>
    e.stopImmediatePropagation(scale = +scaleBtn.value ),
    1
  );
  saveFullBtn.onclick = () => bg.remove(resolve({
    captureBeyondViewport: !0
  }));
  saveVisibleBtn.onclick = () => bg.remove(resolve({
    captureBeyondViewport: !0,
    clip: { x, y, width, height, scale }
  }));
  bg.appendChild(scaleBtn).setAttribute("style",
    "all:unset;position:fixed;z-index:2147483647;right:140px;top:0;width:48px;border:1px dashed;background:#444;font:12px/3 fantasy;color:#ddd;text-align:center;text-overflow:ellipsis;cursor:default"
  );
  bg.appendChild(saveFullBtn).setAttribute("style",
    "all:unset;position:fixed;z-index:2147483647;right:78px;top:0;padding:0 8px;border:1px dashed;background:#0ef;font:12px/3 fantasy;color:#000;cursor:pointer"
  );
  bg.appendChild(saveVisibleBtn).setAttribute("style",
    "all:unset;position:fixed;z-index:2147483647;right:0;top:0;padding:0 8px;border:1px dashed;background:#9f0;font:12px/3 fantasy;color:#000;cursor:pointer"
  );
  root.appendChild(bg).setAttribute("style",
    "all:unset;position:fixed;inset:0;z-index:2147483646;width:100%;height:100%;backdrop-filter:brightness(.8);cursor:crosshair"
  );
  bg.addEventListener("click", e => {
    if (e.target == bg) {
      let px = CSS.px(0);
      let rectStyle = (rect = d.createElement("b")).attributeStyleMap;
      let offsetTop = root.offsetTop;
      let offsetX = root.getBoundingClientRect().x;
      let mousemoveHandler = e => (
        rectStyle.set("height",
          ((px.value = (height = e.pageY - y + offsetTop) > 0 ? height : height = 1), px)),
        rectStyle.set("width",
          ((px.value = (width = e.pageX - x - offsetX) > 0 ? width : width = 1), px))
      );
      let scrollHandler = () => (
        rectStyle.set("height",
          ((px.value = (height = height - scrollTop + (scrollTop = root.scrollTop)) > 0 ? height : height = 1), px)),
        rectStyle.set("width",
          ((px.value = (width = width - scrollLeft + (scrollLeft = root.scrollLeft)) > 0 ? width : width = 1), px))
      );
      scrollLeft = root.scrollLeft;
      scrollTop = root.scrollTop;
      scaleBtn.remove();
      saveFullBtn.remove();
      saveVisibleBtn.remove();
      root.appendChild(rect).setAttribute("style",
        "height:0;width:0;top:" +
        (y = e.pageY + offsetTop) +
        "px;left:" +
        (x = e.pageX - offsetX) +
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
  bg.addEventListener("contextmenu", e => (
    e.stopImmediatePropagation(),
    bg.remove(),
    rect && rect.remove(),
    resolve()
  ));
}))();`
      }]
    }).then(results => {
      (results &&= results[0].result) && (
        chrome.debugger.attach(target, "1.3"),
        chrome.debugger.sendCommand(target, "Page.captureScreenshot", results, e => (
          chrome.debugger.detach(target),
          chrome.management.getAll(crx =>
            chrome.downloads.download({
              url: "data:image/png;base64," + e.data,
              filename: b.url.replace(/^.*?:\/\//, "").replace(/\/$/, "").replace(/[|?":/<>*\\]/g, "_") + ".png",
              saveAs: !0
            }, (crx = crx.find(v => v.name == "fformat")) && (
                chrome.management.setEnabled(crx = crx.id, !1),
                () => chrome.management.setEnabled(crx, !0)
              )
            )
          )
        ))
      ),
      chrome.action.enable(tabId)
    }).catch(e =>
      e != "Error: Frame with ID 0 was removed." && chrome.action.enable(tabId)
    );
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