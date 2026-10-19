import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { PerspectiveCamera, Scene, Vector2, Matrix4, Group, Vector3, Quaternion } from 'three/webgpu'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const h = vi.hoisted(() => ({controller: undefined as any, plugins: [] as any[], frames: new Map<number, FrameRequestCallback>(), frameId: 0}))
vi.mock('vreo-audit/Player/hooks', () => ({
  useController: () => h.controller,
  useFiveInstance: () => h.controller.five,
}))
vi.mock('@realsee/five-webgpu', () => ({ Five: { Mode: { Panorama: 'Panorama', Model: 'Model', Floorplan: 'Floorplan', Mapview: 'Mapview' } } }))
vi.mock('@realsee/dnalogel/plugins/pano-tag', async () => {
  const actual = await vi.importActual<any>('@realsee/dnalogel/plugins/pano-tag')
  return { ...actual, PanoTagPlugin(...args: any[]) {
    const instance = actual.PanoTagPlugin(...args)
    h.plugins.push(instance)
    return instance
  } }
})
import { PanoTag } from 'vreo-audit/Player/modules/keyframes/PanoTag'
import { PlaybackLifecycle } from 'vreo-audit/Player/PlaybackLifecycle'
import LegacyTextTag from 'vreo-legacy-text-tag'
import LegacyImageTextTag from 'vreo-legacy-image-text-tag'

function emitter() {
  const events = new Map<string, Set<(value: any) => void>>()
  return {
    on(type: string, cb: (value:any)=>void) {const s=events.get(type)??new Set();s.add(cb);events.set(type,s)},
    off(type:string, cb:(value:any)=>void) {events.get(type)?.delete(cb)},
    emit(type:string, value?:any) {for(const cb of [...events.get(type)??[]])cb(value)},
    listenerCount() {return [...events.values()].reduce((n,s)=>n+s.size,0)},
  }
}
function createController() {
  const host = document.createElement('div'), canvas=document.createElement('canvas')
  host.appendChild(canvas);document.body.appendChild(host)
  Object.defineProperties(host, {clientWidth:{value:800},clientHeight:{value:600}})
  Object.defineProperties(canvas, {clientWidth:{value:800},clientHeight:{value:600}})
  const camera=new PerspectiveCamera(90,800/600,.1,1000);camera.updateMatrixWorld()
  const state={mode:'Panorama',panoIndex:0,longitude:0,latitude:0,fov:90}
  const five={
    ...emitter(),model:{loaded:true,root:new Group()},models:[],scene:new Scene(),camera,state,
    getElement:()=>canvas,getCurrentState:()=>state,
    work:{observers:[{position:new Vector3(),quaternion:new Quaternion()}],transform:new Matrix4(),floorplan:{floors:[]}},
    workUtil:{transform:new Matrix4(),getObserverPosition:()=>camera.position},
    get workCode(){return 'QA'},
    renderer:{getSize:(out:Vector2)=>out.set(800,600),getPixelRatio:()=>1},
    ready:()=>Promise.resolve(),
  }
  return {...emitter(),five,playback:new PlaybackLifecycle(undefined,()=>undefined),configs:{keyframeMap:{}}}
}
function keyframe(text='QA PanoTag text', imgUrl?:string) {
  return {type:'PanoTag',start:0,end:8000,data:{type:'Text',style:'Growth',text,imgUrl,vertex:{x:0,y:0,z:-2}}}
}
let root:Root|undefined
beforeEach(async()=>{
  Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true})
  vi.useFakeTimers({toFake:['setTimeout','clearTimeout','Date']})
  h.frames=(globalThis as any).__VREO_PANOTAG_RAF__.frames;h.frames.clear()
  vi.stubGlobal('ResizeObserver',class {observe(){} unobserve(){} disconnect(){}})
  vi.spyOn(HTMLMediaElement.prototype,'load').mockImplementation(()=>undefined)
  vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>undefined)
  h.plugins.length=0;h.controller=createController();h.controller.playback.begin(true)
  const c=document.createElement('div');document.body.appendChild(c);root=createRoot(c)
  await act(async()=>root!.render(<PanoTag/>))
})
afterEach(async()=>{
  await act(async()=>{root?.unmount();root=undefined})
  for(const p of h.plugins)p.dispose()
  document.body.innerHTML='';vi.clearAllTimers();vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals()
})
async function emitTag(value=keyframe()) {
  await act(async()=>h.controller.emit('PanoTag',value))
}
async function renderTags() {
  await act(async()=>h.controller.five.emit('render.prepare'))
  await act(async()=>{const frames=[...h.frames.values()];h.frames.clear();for(const cb of frames)cb(performance.now())})
}
function textCharacters(e:Element) {
  return [...e.querySelectorAll('.text-char')].map(n=>n.textContent).join('').replace(/\u00a0/g,' ')
}
function legacyText(text:string) {
  const target=document.createElement('div');document.body.appendChild(target)
  const component=new LegacyTextTag({target,props:{tag:{data:{text},state:{unfolded:true}}}})
  return {target,dispose:()=>{component.$destroy();target.remove()}}
}

describe('actual Vreo PanoTag + actual compiled Dnalogel9',()=>{
 it('positive control: installed public contract has no removed private render method',()=>{
   const p=h.plugins[0]
   expect(p.updateRenderAllTags).toBeUndefined()
   for(const name of ['load','getTagById','destroyTagById','dispose']) expect(typeof p[name]).toBe('function')
 })
 it('loads and publicly unfolds actual rendered Text without the removed-method exception',async()=>{
   await emitTag()
   const p=h.plugins[0],t=p.tags[0]
   expect(t.data.title).toBe('QA PanoTag text')
   expect(t.state.unfolded).toBe(true)
   await renderTags()
   expect(document.body.textContent?.replace(/\u00a0/g,' ')).toContain('QA PanoTag text')
 })
 it.each(['QA plain','QA line 1\nline 2','<b>QA literal</b> & 24K'])('retains old actual Text renderer string semantics: %s',async(text)=>{
   const old=legacyText(text)
   try {
     await emitTag(keyframe(text))
     await renderTags()
     const tag=h.plugins[0].tags[0],node=document.getElementById('tag-'+tag.id)!
     expect(tag.data.title).toBe(text)
     expect(textCharacters(old.target)).toBe(text.replace(/\n/g,''))
     expect(textCharacters(node)).toBe(textCharacters(old.target))
     expect(node.querySelectorAll('br').length).toBe(old.target.querySelectorAll('br').length)
     expect(node.querySelectorAll('b').length).toBe(0)
     expect(old.target.querySelectorAll('b').length).toBe(0)
   } finally {old.dispose()}
 })
 it.each(['QA pic','QA\nline','<b>QA</b>'])('adapts ImageText title and matches actual old renderer: %s',async(text)=>{
   const image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg=='
   await emitTag(keyframe(text,image))
   const p=h.plugins[0],t=p.tags[0]
   expect(t.contentType).toBe('ImageText')
   expect(t.data.title).toBe(text)
   expect(t.data.mediaData).toEqual([{type:'Image',url:image}])
   expect(t.state.unfolded).toBe(true)
   await renderTags()
   const target=document.createElement('div');document.body.appendChild(target)
   const legacyTag=Object.create(t)
   Object.defineProperty(legacyTag,'data',{value:{text,mediaData:[{type:'Image',url:image}]}})
   const old=new LegacyImageTextTag({target,props:{tag:legacyTag},context:new Map([['hooks',p.hooks],['mediaStore',p.mediaStore]])})
   try {
     const node=document.getElementById('tag-'+t.id)!
     expect(textCharacters(node)).toBe(textCharacters(target))
     expect(node.querySelectorAll('br').length).toBe(target.querySelectorAll('br').length)
     expect(node.querySelectorAll('b').length).toBe(0)
     expect(target.querySelectorAll('b').length).toBe(0)
     expect(textCharacters(target)).toBe((text.length>7?text.substring(0,6)+'...':text).replace(/\n/g,''))
   } finally {old.$destroy();target.remove()}
 })
 it('naturally folds through the real synchronous public folded event, then destroys this tag',async()=>{
   await emitTag();const p=h.plugins[0],t=p.tags[0],folded=vi.fn()
   t.hooks.on('folded',folded)
   await act(async()=>vi.advanceTimersByTime(8000))
   expect(t.state.unfolded).toBe(false)
   expect(folded).toHaveBeenCalledTimes(1)
   expect(p.tags).toHaveLength(1)
   await act(async()=>vi.advanceTimersByTime(1500))
   expect(p.tags).toHaveLength(0)
 })
 it('early unmount removes actual tag DOM and releases the private plugin and Five event owner',async()=>{
   await emitTag();await renderTags();const p=h.plugins[0],id=p.tags[0].id
   expect(document.getElementById('tag-'+id)).not.toBeNull()
   await act(async()=>{root!.unmount();root=undefined})
   expect(p.tags).toHaveLength(0)
   expect(p.store.disposed).toBe(true)
   expect(h.controller.listenerCount()).toBe(0)
   expect(h.controller.five.listenerCount()).toBe(0)
   expect(document.getElementById('tag-'+id)).toBeNull()
   await act(async()=>vi.advanceTimersByTime(10000))
   expect(p.tags).toHaveLength(0)
 })
 it('playback cancel clears current tag and old deadline cannot delete a later replay tag',async()=>{
   await emitTag(keyframe('QA old'));const p=h.plugins[0],oldId=p.tags[0].id
   await act(async()=>vi.advanceTimersByTime(1000))
   await act(async()=>h.controller.playback.cancel())
   expect(p.tags).toHaveLength(0)
   h.controller.playback.begin(true)
   await emitTag(keyframe('QA new'));const id=p.tags[0].id
   expect(id).not.toBe(oldId)
   await act(async()=>vi.advanceTimersByTime(7000))
   expect(p.tags.map((t:any)=>t.id)).toEqual([id])
   expect(p.tags[0].state.unfolded).toBe(true)
   await act(async()=>h.controller.playback.finish())
   expect(p.tags).toHaveLength(0)
 })
 it('cancellation while actual load waits for modelLoaded cannot revive the old tag',async()=>{
   h.controller.five.model.loaded=false
   await emitTag();const p=h.plugins[0]
   expect(p.tags).toHaveLength(1)
   await act(async()=>h.controller.playback.cancel())
   expect(p.tags).toHaveLength(0)
   await act(async()=>vi.advanceTimersByTime(10000))
   expect(p.tags).toHaveLength(0)
   expect(p.store.disposed).toBe(false)
   h.controller.five.model.loaded=true
   await act(async()=>h.controller.five.emit('modelLoaded',h.controller.five.model))
   expect(p.tags).toHaveLength(0)
   await act(async()=>vi.advanceTimersByTime(10000))
   expect(p.tags).toHaveLength(0)
 })
 it('an actual asynchronous load resolving after the keyframe deadline cannot unfold expired content',async()=>{
   h.controller.five.model.loaded=false
   await emitTag();const p=h.plugins[0]
   expect(p.tags).toHaveLength(1)
   await act(async()=>vi.advanceTimersByTime(8000))
   expect(p.tags[0].state.unfolded).toBe(false)
   h.controller.five.model.loaded=true
   await act(async()=>h.controller.five.emit('modelLoaded',h.controller.five.model))
   expect(p.tags).toHaveLength(0)
 })
 it('model readiness after deadline and destroy grace cannot recreate an expired owned tag',async()=>{
   h.controller.five.model.loaded=false
   await emitTag();const p=h.plugins[0]
   expect(p.tags).toHaveLength(1)
   await act(async()=>vi.advanceTimersByTime(10000))
   expect(p.tags).toHaveLength(0)
   expect(p.store.disposed).toBe(false)
   h.controller.five.model.loaded=true
   await act(async()=>h.controller.five.emit('modelLoaded',h.controller.five.model))
   expect(p.tags).toHaveLength(0)
   await renderTags()
   expect(document.querySelector('[id^="tag-"]')).toBeNull()
 })
 it('keeps one effect owner on ordinary rerender and releases it on controller replacement',async()=>{
   await emitTag();const p=h.plugins[0],oldController=h.controller
   await act(async()=>root!.render(<PanoTag/>))
   expect(h.plugins).toHaveLength(1)
   h.controller=createController();h.controller.playback.begin(true)
   await act(async()=>root!.render(<PanoTag/>))
   expect(h.plugins).toHaveLength(2)
   expect(p.store.disposed).toBe(true)
   expect(p.tags).toHaveLength(0)
   expect(oldController.five.listenerCount()).toBe(0)
   await emitTag(keyframe('QA replacement'))
   expect(h.plugins[1].tags[0].data.title).toBe('QA replacement')
 })
 it('does not construct a private plugin for an explicitly disabled keyframe module',async()=>{
   await act(async()=>{root!.unmount();root=undefined})
   h.plugins.length=0;h.controller=createController();h.controller.configs.keyframeMap.PanoTag=false
   const c=document.createElement('div');document.body.appendChild(c);root=createRoot(c)
   await act(async()=>root!.render(<PanoTag/>))
   expect(h.plugins).toHaveLength(0)
   expect(h.controller.five.listenerCount()).toBe(0)
 })
})
