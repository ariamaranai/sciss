(async () => await new Promise(resolve => {
  let d = document;
  let root = d.scrollingElement || d.documentElement;
  let bg = root.appendChild(d.createElement("b"));
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

  let generate = (a, b, c, d) => resolve({
    captureBeyondViewport: !0,
    clip: {
      x: a,
      y: b,
      width: c,
      height: d,
      scale
    }
  });

  scaleBtn.addEventListener("click", e => e.stopImmediatePropagation(scale = +scaleBtn.value), 1);
  saveFullBtn.onclick = () => bg.remove(generate(0, 0, root.scrollWidth * scale,  root.scrollHeight * scale));
  saveVisibleBtn.onclick = () => bg.remove(generate(x * scale, y * scale, width * scale,  height * scale));
  bg.addEventListener("click", e => {
    if (e.target == bg) {
      saveVisibleBtn.remove(saveFullBtn.remove(scaleBtn.remove()));
      root.appendChild(rect = d.createElement("b")).setAttribute("style", "display:flow;width:0;height:0;position:absolute;inset:0;z-index:2147483647;box-sizing:border-box;border:1px dashed #fff;backdrop-filter:brightness(1.2);cursor:crosshair");
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
      bg.addEventListener("click", () => (
        generate(x * scale, y * scale, width * scale, height * scale),
        rect.remove(bg.remove(removeEventListener("scroll", scrollHandler)))
      ), { once: !0 });
      addEventListener("scroll", scrollHandler);
    }
  }, { once: !0 });
  bg.addEventListener("contextmenu", e =>
    resolve(bg.remove(e.stopImmediatePropagation(rect?.remove()))),
    1
  );
  bg.setAttribute("style", "all:unset;position:fixed;inset:0;z-index:2147483646;width:100%;height:100%;backdrop-filter:brightness(.8);cursor:crosshair");
}))();