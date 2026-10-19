import React,{act} from 'react'
import {createRoot,type Root} from 'react-dom/client'
import {beforeEach,afterEach,it,expect,vi} from 'vitest'
const h=vi.hoisted(()=>({controller:undefined as any}))
vi.mock('vreo-audit/Player/hooks',()=>({useController:()=>h.controller}))
import {BgMusic} from 'vreo-audit/Player/modules/keyframes/BgMusic'
import {PlaybackLifecycle} from 'vreo-audit/Player/PlaybackLifecycle'
import {audioList,generateBlankAudio} from 'vreo-audit/shared-utils/Audio'
import {PlaybackRuntime} from 'nextvr-host/playback'
import {AudioFocusCoordinator} from 'nextvr-host/coordinator'
let root:Root|undefined,coordinator:AudioFocusCoordinator,manager:PlaybackRuntime,playback:PlaybackLifecycle
let readyListeners:Array<{element:HTMLMediaElement;listener:EventListener}>=[]
let playIO:ReturnType<typeof vi.spyOn>
const cue=(url='/qa-owner-d.mp3')=>({uuid:`qa-${url}`,type:'BgMusic',start:0,end:10000,data:{url}})
const emit=async(url='/qa-owner-d.mp3')=>{
 await act(async()=>{
  expect(playback.begin(true)).toBe(true)
  h.controller.emit('BgMusic',cue(url),0)
 })
 return audioList.find((element:any)=>element.realSrc===url) as HTMLAudioElement&{realSrc:string}
}
const cancel=async()=>{await act(async()=>playback.cancel())}
beforeEach(async()=>{
 // Platform I/O seam only. No clearing/src/ownership/pool behavior is supplied.
 // JSDOM lacks native playback; these tests never claim decoding or a clock.
 playIO=vi.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue(undefined)
 vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>undefined)
 vi.spyOn(HTMLMediaElement.prototype,'load').mockImplementation(()=>undefined)
 const nativeAdd=HTMLMediaElement.prototype.addEventListener
 vi.spyOn(HTMLMediaElement.prototype,'addEventListener').mockImplementation(function(this:HTMLMediaElement,type:string,listener:any,options?:any){
  if(type==='canplay')readyListeners.push({element:this,listener})
  return nativeAdd.call(this,type,listener,options)
 })
 coordinator=new AudioFocusCoordinator();manager=new PlaybackRuntime(coordinator)
 playback=new PlaybackLifecycle(manager,()=>{})
 const events=new Map<string,Set<Function>>()
 h.controller={playback,configs:{waitForBgMusicLoaded:true},waitingForBgMusic:false,
  setWaitingForBgMusic(value:boolean){this.waitingForBgMusic=value},
  on(name:string,callback:Function){const set=events.get(name)||new Set();set.add(callback);events.set(name,set)},
  off(name:string,callback:Function){events.get(name)?.delete(callback)},
  emit(name:string,...args:any[]){for(const callback of [...events.get(name)||[]])callback(...args)}}
 generateBlankAudio(3)
 const container=document.createElement('div');document.body.appendChild(container);root=createRoot(container)
 await act(async()=>root!.render(<BgMusic/>))
})
afterEach(async()=>{
 await act(async()=>{root?.unmount();root=undefined;playback?.dispose()})
 coordinator?.dispose()
 // Test isolation occurs only after assertions. It cannot make product cleanup pass.
 for(const element of audioList)element.removeDocumentEventListener()
 audioList.splice(0);document.body.innerHTML='';readyListeners=[];vi.restoreAllMocks()
})
it('environment prerequisite: actual IAudio derives from native audio and owns the actual src/realSrc descriptor',()=>{
 const element=audioList[0]
 expect(element).toBeInstanceOf(HTMLAudioElement)
 const descriptor=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element),'src')
 expect(typeof descriptor?.get).toBe('function');expect(typeof descriptor?.set).toBe('function')
 element.src='/qa-environment-only.mp3';expect(element.realSrc).toBe('/qa-environment-only.mp3')
 element.src='';expect(element.realSrc).toBe('')
})
it('real host cancellation returns the actual BgMusic-owned resource to idle, then component selects it again',async()=>{
 const first=await emit();expect(first).toBeInstanceOf(HTMLAudioElement);expect(audioList.length).toBe(3)
 await cancel()
 expect(first.realSrc).toBe('');expect(first.getAttribute('src')).toBeNull()
 const next=await emit('/qa-owner-e.mp3');expect(next).toBe(first);expect(audioList.length).toBe(3)
})
it('repeated real pause/begin/keyframe cycles reuse the pool without accumulating occupied entries',async()=>{
 const selected:HTMLMediaElement[]=[]
 for(let i=0;i<6;i++){
  const element=await emit(`/qa-repeat-${i}.mp3`);selected.push(element)
  await cancel()
  expect(audioList.filter((audio:any)=>audio.realSrc.startsWith('/qa-repeat-'))).toHaveLength(0)
 }
 expect(new Set(selected).size).toBe(1);expect(audioList.length).toBe(3)
})
it('actual natural finish returns the resource before the captured host session finishes',async()=>{
 const first=await emit()
 await act(async()=>playback.finish())
 expect(first.realSrc).toBe('');expect(first.getAttribute('src')).toBeNull()
 expect(playback.active).toBe(false)
 const next=await emit('/qa-after-natural.mp3');expect(next).toBe(first)
})
it('another real sound owner interrupts Vreo and returns its old pool resource',async()=>{
 const first=await emit()
 const next=manager.createController({label:'actual competing sound',onCancel:()=>{}})
 await act(async()=>{expect(next.begin({userAction:true,audible:true})).not.toBeNull()})
 expect(playback.active).toBe(false)
 expect(first.realSrc).toBe('');expect(first.getAttribute('src')).toBeNull()
 next.dispose()
})
it('actual lifecycle dispose returns the pool resource even though its parent session is already retired',async()=>{
 const first=await emit()
 await act(async()=>playback.dispose())
 expect(first.realSrc).toBe('');expect(first.getAttribute('src')).toBeNull()
})
it('a retained actual old clean callback cannot clear a new owner that reused the same real pool element',async()=>{
 const first=await emit()
 const oldClean=[...(playback as any).members][0] as()=>void
 expect(typeof oldClean).toBe('function')
 await cancel()
 const next=await emit('/qa-next-owner.mp3');expect(next).toBe(first)
 await act(async()=>oldClean())
 expect(next.realSrc).toBe('/qa-next-owner.mp3');expect(next.getAttribute('src')).toBe('/qa-next-owner.mp3')
 expect(playback.active).toBe(true)
})
it('a retained actual old canplay callback cannot restart or clear a reused later owner',async()=>{
 const first=await emit()
 const oldReady=readyListeners.find(record=>record.element===first)!.listener
 expect(typeof oldReady).toBe('function')
 await cancel()
 const next=await emit('/qa-next-ready-owner.mp3');expect(next).toBe(first)
 const playsBefore=playIO.mock.calls.length
 await act(async()=>oldReady.call(first,new Event('canplay')))
 expect(playIO.mock.calls.length).toBe(playsBefore)
 expect(next.realSrc).toBe('/qa-next-ready-owner.mp3');expect(playback.active).toBe(true)
})
it('normal component unmount while its host run is active clears the actual owned pool resource',async()=>{
 const first=await emit()
 await act(async()=>{root!.unmount();root=undefined})
 expect(first.realSrc).toBe('');expect(first.getAttribute('src')).toBeNull()
})
