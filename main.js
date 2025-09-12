(async () => {
  let bg;
  let d = document;
  let rect = d.createElement("rc");
  let onResize;
  let onScroll;
  let value = await new Promise(resolve => {
    let root = d.scrollingElement;
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

    (bg = root.appendChild(d.createElement("bg"))).innerHTML = "<input type=number value=1 min=.25 max=5 step=.25 style='all:unset;position:fixed;z-index:2147483647;right:156px;top:0;width:48px;background:#fff;font:12px/3 arial;border-radius:2px;color:#000;text-align:center;cursor:default'><p style='all:unset;position:fixed;z-index:2147483647;right:86px;top:0;padding:0+8px;border-radius:2px;background:#0ef;font:12px/3 arial;color:#000;cursor:pointer'>Save Full<p style='all:unset;position:fixed;z-index:2147483647;right:0;top:0;padding:0+8px;border-radius:2px;background:#9f0;font:12px/3 arial;color:#000;cursor:pointer'>Save Visible";
    bg.setAttribute("style", "all:unset;position:fixed;inset:0;z-index:2147483647;width:100vw;height:100vh;backdrop-filter:brightness(.8);cursor:crosshair");

    let scaleBtn = bg.firstChild;
    scaleBtn.addEventListener("change", e => e.stopImmediatePropagation(scale = Math.max(Math.min(+e.target.value, 5), .25)), 1);

    let saveFullBtn = scaleBtn.nextSibling;
    saveFullBtn.onclick = () => clip(0, 0, root.scrollWidth, root.scrollHeight);

    let saveVisibleBtn = bg.lastChild;
    saveVisibleBtn.onclick = () => clip(x, y, width,  height);

    addEventListener("resize", onResize = () => zoom = devicePixelRatio, 1);

    let onClick = e => {
      if (e.target == bg) {
        bg.textContent = "";
        bg.removeEventListener("click", onClick, 1);
        root.appendChild(rect).setAttribute("style", "all:unset;width:0;height:0;position:absolute;inset:0;z-index:2147483647;box-sizing:border-box;border:1px dashed#fff;backdrop-filter:brightness(1.2);cursor:crosshair");
        let { scrollLeft, scrollTop } = root;
        let bcr = rect.getBoundingClientRect();
        let px = CSS.px(0);
        let rectStyleMap = rect.attributeStyleMap;
        let onMouseMove = e => (
          rectStyleMap.set("width", ((px.value = (width = e.pageX - x) > 0 ? width : width = 1), px)),
          rectStyleMap.set("height", ((px.value = (height = e.pageY - y) > 0 ? height : height = 1), px))
        );
        rectStyleMap.set("left", (px.value = (x = e.pageX) - bcr.x - scrollLeft, px));
        rectStyleMap.set("top", (px.value = (y = e.pageY) - bcr.y - scrollTop, px));
        rect.addEventListener("mousemove", onMouseMove);
        bg.addEventListener("mousemove", onMouseMove);
        bg.addEventListener("click", () => clip(x, y, width, height), { capture: !0, once: !0 });
        addEventListener("scroll", onScroll = () => (
          rectStyleMap.set("width", ((px.value = (width = width - scrollLeft + (scrollLeft = root.scrollLeft)) > 0 ? width : width = 1), px)),
          rectStyleMap.set("height", ((px.value = (height = height - scrollTop + (scrollTop = root.scrollTop)) > 0 ? height : height = 1), px))
        ));
      }
    }
    bg.addEventListener("click", onClick, 1);
    bg.addEventListener("contextmenu", e => resolve(e.stopImmediatePropagation()), 1);
  });
  bg.remove();
  rect?.remove();
  removeEventListener("resize", onResize, 1);
  onScroll && removeEventListener("scroll", onScroll);
  return value;
})();