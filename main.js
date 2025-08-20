(async () => {
  let bg;
  let rect;
  let resizeHandler;
  let scrollHandler;
  let value = await new Promise(resolve => {
    let d = document;
    let root = d.scrollingElement;
    let x = root.scrollLeft;
    let y = root.scrollTop;
    let width = innerWidth;
    let height = innerHeight;
    let zoom = devicePixelRatio;
    let scale = 1;

    (bg = root.appendChild(d.createElement("z"))).innerHTML = "<input type=number value=1 min=.25 max=5 step=.25 style='all:unset;position:fixed;z-index:2147483647;right:144px;top:0;width:48px;background:#fff;font:12px/3 fantasy;border-radius:2px;color:#000;text-align:center;cursor:default'><p style='all:unset;position:fixed;z-index:2147483647;right:80px;top:0;padding:0+8px;border-radius:2px;background:#0ef;font:12px/3 fantasy;color:#000;cursor:pointer'>Save Full<p style='all:unset;position:fixed;z-index:2147483647;right:0;top:0;padding:0+8px;border-radius:2px;background:#9f0;font:12px/3 fantasy;color:#000;cursor:pointer'>Save Visible"
    bg.setAttribute("style", "all:unset;position:fixed;inset:0;z-index:2147483646;width:100%;height:100%;backdrop-filter:brightness(.8);cursor:crosshair");

    let scaleBtn = bg.firstChild;
    scaleBtn.addEventListener("change", e => e.stopImmediatePropagation(scale = Math.max(Math.min(+e.target.value, 5), .25)), 1);

    let saveFullBtn = scaleBtn.nextSibling;
    saveFullBtn.onclick = () => success(0, 0, root.scrollWidth, root.scrollHeight);

    let saveVisibleBtn = bg.lastChild;
    saveVisibleBtn.onclick = () => success(x, y, width,  height);

    let success = (a, b, c, d) => resolve({
      captureBeyondViewport: !0,
      clip: {
        x: a * zoom,
        y: b * zoom,
        width: c * zoom,
        height: d * zoom,
        scale
      }
    });
    addEventListener("resize", resizeHandler = () => zoom = devicePixelRatio, 1);
    bg.addEventListener("click", e => {
      if (e.target == bg) {
        saveVisibleBtn.remove(saveFullBtn.remove(scaleBtn.remove()));
        root.appendChild(rect = d.createElement("dt")).setAttribute("style", "all:unset;width:0;height:0;position:absolute;inset:0;z-index:2147483647;box-sizing:border-box;border:1px dashed#fff;backdrop-filter:brightness(1.2);cursor:crosshair");
        let { scrollLeft, scrollTop } = root;
        let bcr = rect.getBoundingClientRect();
        let px = CSS.px(0);
        let rectStyleMap = rect.attributeStyleMap;
        let mousemoveHandler = e => (
          rectStyleMap.set("width", ((px.value = (width = e.pageX - x) > 0 ? width : width = 1), px)),
          rectStyleMap.set("height", ((px.value = (height = e.pageY - y) > 0 ? height : height = 1), px))
        );
        rectStyleMap.set("left", (px.value = (x = e.pageX) - bcr.x - scrollLeft, px));
        rectStyleMap.set("top", (px.value = (y = e.pageY) - bcr.y - scrollTop, px));
        rect.addEventListener("mousemove", mousemoveHandler);
        bg.addEventListener("mousemove", mousemoveHandler);
        bg.addEventListener("click", () => success(x, y, width, height), { capture: !0, once: !0 });
        addEventListener("scroll", scrollHandler = () => (
          rectStyleMap.set("width", ((px.value = (width = width - scrollLeft + (scrollLeft = root.scrollLeft)) > 0 ? width : width = 1), px)),
          rectStyleMap.set("height", ((px.value = (height = height - scrollTop + (scrollTop = root.scrollTop)) > 0 ? height : height = 1), px))
        ));
      }
    }, { capture: !0, once: !0 });
    bg.addEventListener("contextmenu", e => resolve(e.stopImmediatePropagation()), 1);
  });

  bg.remove();
  rect?.remove();
  removeEventListener("resize", resizeHandler);
  scrollHandler && removeEventListener("scroll", scrollHandler);
  return value;
})();