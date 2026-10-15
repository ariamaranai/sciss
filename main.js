(async d => {
  let bg;
  let rect = d.createElement("rc");
  let onResize;
  let onScroll;
  let styleChanged = [];
  try {
    var result = await new Promise(resolve => {
      let root = d.scrollingElement;
      let walker = d.createTreeWalker(root, 1);
      let node = walker.currentNode;
      while (node) {
        let overflowY = getComputedStyle(node).overflowY;
        if (overflowY === "auto" || overflowY === "scroll") {
          styleChanged.push(node, node.getAttribute("style"));
          let style = node.style;
          style.height = style.overflowY = "auto!important";

          let parentElement = node.parentElement;
          while (parentElement)
            styleChanged.push(parentElement, parentElement.getAttribute("style")),
            style = parentElement.style,
            style.height = style.overflowY = "auto!important",
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
      let onClick = e => {
        if (e.target !== bg)
          return;
        bg.removeEventListener("click", onClick, 1);
        root.appendChild(rect).setAttribute("style", "all:unset;width:0;height:0;position:absolute;inset:0;z-index:2147483647;box-sizing:border-box;border:dashed#fff+1px;backdrop-filter:brightness(1.2);cursor:crosshair");
        let scrollLeft = root.scrollLeft;
        let scrollTop = root.scrollTop;
        let bcr = rect.getBoundingClientRect();
        let onMouseMove = e => (
          rect.style.width = (width = Math.max(e.pageX - x, 1)) + "px",
          rect.style.height = (height = Math.max(e.pageY - y, 1)) + "px"
        );
        rect.style.inset = ((y = e.pageY) - bcr.y - scrollTop) + "px+0+0+" + ((x = e.pageX) - bcr.x - scrollLeft) + "px";
        rect.addEventListener("mousemove", onMouseMove);
        bg.addEventListener("mousemove", onMouseMove);
        bg.addEventListener("click", () => clip(x, y, width, height), { capture: !0, once: !0 });
        addEventListener("scroll", onScroll = () => (
          rect.style.width = Math.max(width - scrollLeft + (scrollLeft = root.scrollLeft), 1) + "px",
          rect.style.height = height = Math.max(height - scrollTop + (scrollTop = root.scrollTop), 1) + "px"
        ));
      }
      (bg = root.appendChild(d.createElement("bg"))).setAttribute("style", "all:unset;position:fixed;inset:0;z-index:2147483647;width:100vw;height:100vh;backdrop-filter:brightness(.8);cursor:crosshair");

      let port = chrome.runtime.connect();
      port.onMessage.addListener(m => (
        scale = Math.max(Math.min(m[1], 5), .25),
        m[0] && (m[0] === 1 ? clip(0, 0, root.scrollWidth, root.scrollHeight) : clip(x, y, width, height))
      )),
      port.onDisconnect.addListener(() => resolve());
      addEventListener("resize", onResize = () => zoom = devicePixelRatio, 1);
      bg.addEventListener("click", onClick, 1);
      bg.addEventListener("contextmenu", e => resolve(e.stopImmediatePropagation()), 1);
    });
  } catch {}
  bg.remove();
  rect?.remove();
  removeEventListener("resize", onResize, 1);
  onScroll && removeEventListener("scroll", onScroll);
  let i = styleChanged.length;
  while (i) {
    let style = styleChanged[--i];
    style ? styleChanged[--i].setAttribute("style", style) : styleChanged[--i].removeAttribute("style");
  }
  return result;
})(document);