{let r=(a,b)=>(b??=a).url[0]!="c"&&(chrome.action.disable(d=b.id),chrome.scripting.executeScript({target:i={tabId:d},world:"MAIN",func:()=>new Promise(j=>{let p=CSS.px(0),a=document.scrollingElement,b=document.createElement("b"),o=b.cloneNode(),v=b.cloneNode(b.appendChild(o).setAttribute("style","all:unset;position:fixed;z-index:2147483647;right:76px;top:0;padding:8px;border:1px dashed;background:#0ef;font:12px fantasy;color:#000;cursor:pointer")),q=b.cloneNode(b.appendChild(v).setAttribute("style","all:unset;position:fixed;z-index:2147483647;right:0;top:0;padding:8px;border:1px dashed;background:#9f0;font:12px fantasy;color:#000;cursor:pointer")),w=0,h=0,m=q.attributeStyleMap,x,y,l,t,c=e=>(m.set("height",(p.value=(h=e.pageY-y)>0?h:h=1,p)),m.set("width",(p.value=(w=e.pageX-x)>0?w:w=1,p))),s=()=>(m.set("height",(p.value=(h=h-t+(t=a.scrollTop))>0?h:h=1,p)),m.set("width",(p.value=(w=w-l+(l=a.scrollLeft))>0?w:w=1,p)));a.appendChild(b).setAttribute("style","all:unset;position:fixed;inset:0;z-index:2147483646;height:100%;backdrop-filter:brightness(.8);cursor:crosshair"),o.textContent="Save Full",v.textContent="Save Visible",o.onclick=()=>j({captureBeyondViewport:!b.remove()}),v.onclick=()=>(b.remove(),j({clip:{x:a.scrollLeft,y:a.scrollTop,width:innerWidth,height:innerHeight,scale:devicePixelRatio}})),b.addEventListener("click",e=>e.target==b&&(o.remove(l=a.scrollLeft),v.remove(t=a.scrollTop),a.appendChild(q).setAttribute("style","height:0;width:0;top:"+(y=e.pageY)+"px;left:"+(x=e.pageX)+"px;position:absolute;z-index:2147483647;border:1px dashed #999;box-sizing:border-box;backdrop-filter:brightness(1.2);cursor:crosshair"),addEventListener("mousemove",c),b.addEventListener("click",()=>(b.remove(removeEventListener("mousemove",c)),j({clip:{x,y,width:w,height:h,scale:devicePixelRatio,captureBeyondViewport:!q.remove(removeEventListener("scroll",s))}})),{once:!addEventListener("scroll",s)})),{once:!0}),b.oncontextmenu=()=>j(q.remove(b.remove()))})},async k=>(chrome.action.enable(d),k&&=k[0].result)&&((a=(await chrome.management.getAll()).find(v=>v.name=="file.format"))&&a.enabled?await chrome.management.setEnabled(a=a.id,!1):a=0,await chrome.downloads.download({url:(chrome.debugger.attach(i,"1.3"),k="data:image/png;base64,"+(await chrome.debugger.sendCommand(i,"Page.captureScreenshot",k)).data,chrome.debugger.detach(i),k),filename:b.url.replace(/^.*?:\/\//,"").replace(/[|?":/<>*\\]/g,"_")+".png"}),a&&chrome.management.setEnabled(a,!0)))),i,d;chrome.action.onClicked.addListener(r),chrome.contextMenus.onClicked.addListener(r),chrome.commands.onCommand.addListener(r)}chrome.runtime.onInstalled.addListener(()=>chrome.contextMenus.create({id:"",title:"Take Screenshot",contexts:["all"]}))