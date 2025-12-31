(async () => {
  let bg;
  let d = document;
  let rect = d.createElement("rc");
  let onResize;
  let onScroll;
  let styleChanged = [];
  try {
    var result = await new Promise(resolve => {
      let root = d.scrollingElement;
      let walker = document.createTreeWalker(root, 1);
      let node = walker.currentNode;
      while (node) {
        let overflowY = node.computedStyleMap().get("overflow-y").value;
        if (overflowY == "auto" || overflowY == "scroll") {
          styleChanged.push(node, node.getAttribute("style"));
          let style = node.style;
          style.height = style.overflowY = "unset!important";

          let parentElement = node.parentElement;
          while (parentElement)
            styleChanged.push(parentElement, parentElement.getAttribute("style")),
            style = parentElement.style,
            style.height = style.overflowY = "unset!important",
            parentElement = parentElement.parentElement;

          node = walker.nextSibling();
        } else
          node = walker.nextNode();
      }
      let x = root.scrollLeft;
      let y = root.scrollTop;
      let width = innerWidth;
      let height = innerHeight;
      let zoom = devicePixelRatio;
      let scale = 1;
      let clip = (a, b, c, d) => resolve({
        captureBeyondViewport: !0,
        clip: {
          x: a * zoom,
          y: b * zoom,
          width: c * zoom,
          height: d * zoom,
          scale
        }
      });
    
    addEventListener("resize", onResize = () => zoom = devicePixelRatio, 1);

    (bg = root.appendChild(d.createElement("bg"))).innerHTML = "<input type=number value=1 min=.25 max=5 step=.25 style='all:unset;position:fixed;z-index:2147483647;right:156px;top:0;width:48px;background:#fff;font:12px/3 arial;border-radius:2px;color:#000;text-align:center;cursor:default'><p style='all:unset;position:fixed;z-index:2147483647;right:86px;top:0;padding:0+8px;border-radius:2px;background:#0ef;font:12px/3 arial;color:#000;cursor:pointer'>Save Full<p style='all:unset;position:fixed;z-index:2147483647;right:0;top:0;padding:0+8px;border-radius:2px;background:#9f0;font:12px/3 arial;color:#000;cursor:pointer'>Save Visible";
    bg.setAttribute("style", "all:unset;position:fixed;inset:0;z-index:2147483647;width:100vw;height:100vh;backdrop-filter:brightness(.8);cursor:crosshair");

    let scaleBtn = bg.firstChild;
    scaleBtn.addEventListener("change", e => e.stopImmediatePropagation(scale = Math.max(Math.min(+e.target.value, 5), .25)), 1);

    let saveFullBtn = scaleBtn.nextSibling;
    saveFullBtn.onclick = () => clip(0, 0, root.scrollWidth, root.scrollHeight);

    let saveVisibleBtn = bg.lastChild;
    saveVisibleBtn.onclick = () => clip(x, y, width,  height);

    let onClick = e => {
      if (e.target == bg) {
        bg.textContent = "";
        bg.removeEventListener("click", onClick, 1);
        root.appendChild(rect).setAttribute("style", "all:unset;width:0;height:0;position:absolute;inset:0;z-index:2147483647;box-sizing:border-box;border:1px dashed#fff;backdrop-filter:brightness(1.2);cursor:crosshair");
        let scrollLeft = root.scrollLeft;
        let scrollTop = root.scrollTop;
        let bcr = rect.getBoundingClientRect();
        let px = CSS.px(0);
        let rectStyleMap = rect.attributeStyleMap;
        let onMouseMove = e => (
          px.value = width = Math.max(e.pageX - x, 1),
          rectStyleMap.set("width", px),
          px.value = height = Math.max(e.pageY - y, 1),
          rectStyleMap.set("height", px)
        );
        px.value = (x = e.pageX) - bcr.x - scrollLeft;
        rectStyleMap.set("left",  px);
        px.value = (y = e.pageY) - bcr.y - scrollTop;
        rectStyleMap.set("top", px);
        rect.addEventListener("mousemove", onMouseMove);
        bg.addEventListener("mousemove", onMouseMove);
        bg.addEventListener("click", () => clip(x, y, width, height), { capture: !0, once: !0 });
        addEventListener("scroll", onScroll = () => (
          px.value = width = Math.max(width - scrollLeft + (scrollLeft = root.scrollLeft), 1),
          rectStyleMap.set("width", px),
          px.value = height = Math.max(height - scrollTop + (scrollTop = root.scrollTop), 1),
          rectStyleMap.set("height", px)
        ));
      }
    }
    bg.addEventListener("click", onClick, 1);
    bg.addEventListener("contextmenu", e => resolve(e.stopImmediatePropagation()), 1);
  });
  } catch {}
  bg.remove();
  rect?.remove();
  removeEventListener("resize", onResize, 1);
  onScroll && removeEventListener("scroll", onScroll);
  let i = 0;
  while (i < styleChanged.length) {
    let node = styleChanged[i];
    let style = styleChanged[++i];
    style ? node.setAttribute("style", style) : node.removeAttribute("style");
    ++i;
  }
  return result;
})();