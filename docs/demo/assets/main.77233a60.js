import{r as d,u as o,P as l,j as a,c as p,R as b,a as f,p as y}from"./default.0d8f96c5.js";import{w as m}from"./znRoyv06SZQeqA7m.0057e8ae.js";import{R as _}from"./index.7b295a4c.js";const g={categoryId:"",categoryText:"",configure:{pageTitle:"\u5361\u62C9OK"},frontRequestId:"",index:"",keyframes:[{data:{text:"\u8FD9\u91CC\u662F\u5361\u62C9OK\u5385",type:"Text"},end:3130,start:1440,type:"Prompter",uuid:"9ad75f8c-ed23-4871-3f72-cc20a843b62d"},{data:{text:" \u6709\u5927\u5C0F\u4E24\u4E2A\u5305\u53A2",type:"Text"},end:5e3,start:3290,type:"Prompter",uuid:"697bd3db-a793-4929-05d6-0cd130d9645c"},{data:{text:"\u5927\u5305\u53A2\u9762\u79EF\u7EA650\u33A1",type:"Text"},end:7460,start:5160,type:"Prompter",uuid:"2ae36e51-3084-4d0f-1866-1ada57d2e586"},{data:{text:"\u5C0F\u5305\u53A2\u9762\u79EF\u7EA625\u33A1",type:"Text"},end:9880,start:7630,type:"Prompter",uuid:"99a9de53-6b36-4162-4a6a-2fb99a0eae1b"},{data:{text:"\u95F2\u6687\u4E4B\u4F59\u7EA6\u53CB\u90BB\u9AD8\u6B4C\u4E00\u66F2",type:"Text"},end:12870,start:10510,type:"Prompter",uuid:"7e1d228f-f7e6-433c-8f56-4d444e89f58a"},{data:{text:"\u4E0D\u4EC5\u5FC3\u60C5\u6109\u5FEB",type:"Text"},end:14750,start:13010,type:"Prompter",uuid:"0edd9c61-8d0f-4876-33ec-4e7159791613"},{data:{text:`\u8FD8\u53EF\u4EE5\u5F3A\u8EAB\u5065\u4F53\uFF0C\u63D0\u9AD8\u80BA\u6D3B\u91CF
`,type:"Text"},end:17880,start:15020,type:"Prompter",uuid:"af2118fd-d89b-44a4-7d6f-861b54261fd4"},{data:{url:"https://vrlab-public.ljcdn.com/release/seesay/tools/OK1___aa0be9df0d3d9054fda59183c786b9fb.mp3"},end:3240,start:0,type:"BgMusic",uuid:"a11e3559-e7d3-4a9b-759e-b7cd0597e769"},{data:{url:"https://vrlab-public.ljcdn.com/release/seesay/tools/OK2___2179eb6649ccf4a372ae1713270bd67f.mp3"},end:5040,start:3240,type:"BgMusic",uuid:"12dce972-c625-4b86-c3f2-b7fe69a88a79"},{data:{url:"https://vrlab-public.ljcdn.com/release/seesay/tools/OK3___ec518eb4438419063624b2859aba0947.mp3"},end:7632,start:5040,type:"BgMusic",uuid:"637ae925-d959-404d-9dd7-5b2456fc0470"},{data:{url:"https://vrlab-public.ljcdn.com/release/seesay/tools/OK4___afc8988b77117e836d5c388fc2ad5b67.mp3"},end:10474,start:7630,type:"BgMusic",uuid:"d598e4ed-f683-4963-69fc-bfa62724859b"},{data:{url:"https://vrlab-public.ljcdn.com/release/seesay/tools/OK5___7c9ae4e48328a4e39294f7de650d33b6.mp3"},end:12918,start:10470,type:"BgMusic",uuid:"b50f3ec4-f1b3-49a4-b623-e25688c3a5c0"},{data:{url:"https://vrlab-public.ljcdn.com/release/seesay/tools/OK7___5ab4ced527586c47d56da5409eccd1a7.mp3"},end:16470,start:14630,type:"BgMusic",uuid:"ac5668dc-eead-4356-0132-29e58c9f298e"},{data:{url:"https://vrlab-public.ljcdn.com/release/seesay/tools/OK8___fdf9287557ad229c59e436c29ad431c5.mp3"},end:18e3,start:16490,type:"BgMusic",uuid:"1d527ab0-2b0d-4b3b-5070-94a5925f8f5f"},{data:{url:"https://vrlab-public.ljcdn.com/release/seesay/tools/OK6___a4cf1fc8cd0c17245a80f74f7b31602c.mp3"},end:14540,start:12960,type:"BgMusic",uuid:"d877db46-dcbb-4865-189c-065dc9999863"}],video:{duration:19e3,end:19e3,start:0,url:""}};function x(){const e=d.exports.useRef(),i=o(),[u,s]=d.exports.useState("notReady");return d.exports.useEffect(()=>{if(console.log("useEffect"),e.current)return;const t=new l(i);e.current=t,s("ready"),t.on("paused",()=>s("paused")),t.on("playing",()=>s("playing")),Object.assign(window,{$player:t})},[]),a("div",{className:"btns",children:a("button",{onClick:async()=>{var t,r,c,n;u==="ready"&&((t=e.current)==null||t.show(),await((r=e.current)==null?void 0:r.load(g))),u!=="playing"?(c=e.current)==null||c.play():(n=e.current)==null||n.pause()},disabled:u==="notReady",children:u!=="playing"?"\u64AD\u653E":"\u6682\u505C"})})}const F={imageOptions:{size:1024},textureOptions:{size:64},onlyRenderIfNeeds:!0,antialias:!1,model:{},plugins:[]},v=p(F);b.render(a(d.exports.StrictMode,{children:f(v,{initialWork:y(m),ref:e=>Object.assign(window,{$five:e==null?void 0:e.five}),children:[a(_,{}),a(x,{})]})}),document.getElementById("root"));