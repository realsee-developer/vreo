import{r as n,u,P as l,j as t,c as p,R as f,a as y,p as g}from"./default.cf3f353b.js";import{w as m}from"./znRoyv06SZQeqA7m.0057e8ae.js";import{R as b}from"./index.d64204fa.js";const v={categoryId:"b35b2980-9394-42a4-8ccb-0d2d4c8634fa",categoryText:"b4aff456-9a94-46c8-6e15-13cfa540aed8",frontRequestId:"ffc05d41-e588-48dc-adb7-d20d350ea1b4",index:0,video:{duration:80525,start:0,end:106278,url:""},keyframes:[{uuid:"daf3e3a8-7b48-4df3-eec5-bdc2a1a1c123",type:"BgMusic",start:2e3,end:46e3,parsed:!1,data:{url:"//vrlab-static.ljcdn.com/release/web/see_you_again.cacdbda9.mp3"}},{uuid:"9616775c-3e96-415a-27fd-1c1ad5db00df",type:"InfoPanel",start:5632,end:10632,data:{style:"PopUp",url:"https:////test-vr-public.realsee-cdn.cn/vrframework/test/audio_merged/psHKdM20/aitalk_text/merged.mp4",type:"Video",title:"\u6D4B\u8BD5\u9762\u677F\u95EE\u9898"}},{uuid:"9616775c-3e96-415a-27fd-1c1ad5db00df",type:"InfoPanel",start:12e3,end:2e4,data:{style:"PopUp",url:"https:////test-vr-public.realsee-cdn.cn/vrframework/test/audio_merged/psHKdM20/aitalk_text/merged.mp4",type:"Video",title:"\u6D4B\u8BD5\u9762\u677F\u95EE\u9898"}}]};function w(){const a=n.exports.useRef(),c=u(),[s,r]=n.exports.useState("notReady");return n.exports.useEffect(()=>{if(a.current)return;const e=new l(c);a.current=e,r("ready"),e.on("loaded",()=>console.log("loaded")),e.on("paused",()=>r("paused")),e.on("playing",()=>r("playing")),e.on("ended",()=>console.log("ended")),e.on("playing",()=>console.log("playing")),e.on("paused",d=>console.log({ended:d})),Object.assign(window,{$player:e})},[]),t("div",{className:"btns",children:t("button",{onClick:async()=>{var e,d,o,i;s==="ready"&&((e=a.current)==null||e.show(),await((d=a.current)==null?void 0:d.load(v))),s!=="playing"?(o=a.current)==null||o.play():(i=a.current)==null||i.pause()},disabled:s==="notReady",children:s!=="playing"?"\u64AD\u653E":"\u6682\u505C"})})}const x={imageOptions:{size:1024},textureOptions:{size:64},onlyRenderIfNeeds:!0,antialias:!1,model:{},plugins:[]},k=p(x);f.render(t(n.exports.StrictMode,{children:y(k,{initialWork:g(m),ref:a=>Object.assign(window,{$five:a==null?void 0:a.five}),children:[t(b,{}),t(w,{})]})}),document.getElementById("root"));