{let c=chrome,m=c.contextMenus,f=(a,b)=>(b||a).url[0]!="c"&&c.scripting.executeScript({target:m={tabId:(b||a).id},injectImmediately:!0,world:"MAIN",func:()=>new Promise(r=>{let p=CSS.px(0),a=document.scrollingElement,b=document.createElement("b"),o=b.cloneNode(),v=b.cloneNode(b.appendChild(o).setAttribute("style","all:unset;position:fixed;z-index:2147483647;right:88px;top:2px;padding:8px;border:1px dashed;border-radius:4px;background:#0ef;font:12px fantasy;color:#000;cursor:pointer")),q=b.cloneNode(b.appendChild(v).setAttribute("style","all:unset;position:fixed;z-index:2147483647;right:0;top:2px;padding:8px;border:1px dashed;border-radius:2px;background:#9f0;font:12px fantasy;color:#000;cursor:pointer")),w=0,h=0,m=q.attributeStyleMap,x,y,l,t,c=e=>(m.set("height",(p.value=(h=e.pageY-y)>0?h:h=1,p)),m.set("width",(p.value=(w=e.pageX-x)>0?w:w=1,p))),s=()=>(m.set("height",(p.value=h+=-t+(t=a.scrollTop)>0?h:h=3,p)),m.set("width",(p.value=(w+=-l+(l=a.scrollLeft))>0?w:w=3,p))),i=e=>e.target==b&&(o.remove(l=a.scrollLeft),v.remove(t=a.scrollTop),a.appendChild(q).setAttribute("style","height:0;width:0;top:"+(y=e.pageY)+"px;left:"+(x=e.pageX)+"px;position:absolute;z-index:2147483647;border:1px dashed #999;box-sizing:border-box;backdrop-filter:brightness(2)"),addEventListener("mousemove",c),b.addEventListener("click",z,{once:!addEventListener("scroll",s)})),z=()=>(b.remove(removeEventListener("mousemove",c)),r({clip:{x,y,width:w,height:h,scale:devicePixelRatio,captureBeyondViewport:!q.remove(removeEventListener("scroll",s))}}));a.appendChild(b).setAttribute("style","all:unset;position:fixed;inset:0;z-index:2147483646;height:100%;backdrop-filter:brightness(.5);cursor:crosshair"),o.textContent="Save Full",v.textContent="Save Visible",o.onclick=()=>r({captureBeyondViewport:!b.remove()}),v.onclick=()=>(b.remove(),r({clip:{x:a.scrollLeft,y:a.scrollTop,width:innerWidth,height:innerHeight,scale:devicePixelRatio}})),b.addEventListener("click",i,{once:!0})})},async r=>(r&&=r[0].result)&&(await c.downloads.download({url:((f=c.debugger).attach(m,"1.3"),r="data:image/png;base64,"+(await f.sendCommand(m,"Page.captureScreenshot",r)).data,f.detach(m),r),filename:(r=(r=(await c.management.getAll()).find(v=>v.name=="file.format"))&&await c.runtime.connect(r.id),((b||a).url.replace(/^.*?:\/\//,"").replace(/[|?":/<>*\\]/g,"_")+".png"))}),r&&r.disconnect()));c.runtime.onInstalled.addListener(()=>m.create({id:"",title:"Take Screenshot",contexts:["all"]})),m.onClicked.addListener(f),c.action.onClicked.addListener(f),c.commands.onCommand.addListener(f)}