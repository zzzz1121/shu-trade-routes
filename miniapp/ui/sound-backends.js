(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ShuSoundBackends=factory();})(this,function(){
'use strict';
function browser(host){
 let ctx=null,epoch=0,enabled=false,dead=false;const cache=new Map(),voices=new Set(),loops=new Map();let wanted={};
 function load(url){if(!cache.has(url))cache.set(url,host.fetch(url).then(r=>{if(!r.ok)throw Error('audio asset');return r.arrayBuffer();}).then(b=>ctx.decodeAudioData(b)).catch(()=>{cache.delete(url);return null;}));return cache.get(url);}
 function stopVoice(v){try{v.source.stop();}catch{}v.source.disconnect();v.gain.disconnect();voices.delete(v);}
 function stopLoop(v){try{v.source.stop();}catch{}v.source.disconnect();v.gain.disconnect();}
 function stopEffects(){epoch++;for(const v of [...voices])stopVoice(v);}
 function gain(node,value,seconds=.25){node.gain.cancelScheduledValues(ctx.currentTime);node.gain.setTargetAtTime(value,ctx.currentTime,seconds/4);}
 async function environment(next){wanted=next;if(!ctx||!enabled||dead)return;
  for(const [id,v] of loops){const target=next[id]?next[id].gain:0;v.target=target;gain(v.gain,target);if(!target)host.setTimeout(()=>{if(v.target===0&&loops.get(id)===v){stopLoop(v);loops.delete(id);}},300);}
  for(const [id,spec] of Object.entries(next)){if(!spec.gain||loops.has(id))continue;const buffer=await load(spec.url);if(!buffer||dead||!enabled||!wanted[id]||!wanted[id].gain||loops.has(id))continue;
   const source=ctx.createBufferSource(),g=ctx.createGain();source.buffer=buffer;source.loop=true;g.gain.value=0;source.connect(g);g.connect(ctx.destination);const v={source,gain:g,target:wanted[id].gain};loops.set(id,v);gain(g,v.target,.45);source.start();
  }
 }
 return {
  activate(){if(dead)return;if(!ctx){const Type=host.AudioContext||host.webkitAudioContext;if(!Type)return;ctx=new Type();}enabled=true;return ctx.resume();},
  async play(id,url,volume){if(!ctx||!enabled||dead)return;const turn=epoch,deadline=Date.now()+400,buffer=await load(url);if(!buffer||turn!==epoch||!enabled||dead||Date.now()>deadline||ctx.state!=='running')return;
   if(voices.size>=4)stopVoice(voices.values().next().value);const source=ctx.createBufferSource(),g=ctx.createGain();source.buffer=buffer;g.gain.value=volume;source.connect(g);g.connect(ctx.destination);const v={source,gain:g};voices.add(v);source.onended=()=>{if(voices.delete(v)){source.disconnect();g.disconnect();}};source.start();
  },environment,stopEffects,
  effectsVolume(){stopEffects();},
  suspend(){enabled=false;stopEffects();for(const v of loops.values())stopLoop(v);loops.clear();if(ctx)return ctx.suspend();},
  destroy(){dead=true;enabled=false;stopEffects();for(const v of loops.values())stopLoop(v);loops.clear();cache.clear();if(ctx)return ctx.close();},
  get diagnostics(){return {effects:voices.size,loops:loops.size,context:ctx?ctx.state:'locked'};}
 };
}
// Feature-detected native adapter. Missing/failed audio never blocks the game.
function native(api){
 const effects=new Set(),loops=new Map(),fading=new Set();let dead=false;
 function dispose(a){if(a._fade)clearInterval(a._fade);try{a.stop();a.destroy();}catch{}effects.delete(a);fading.delete(a);}
 function context(url,volume,loop=false){if(dead||!api||typeof api.createInnerAudioContext!=='function')return null;const a=api.createInnerAudioContext();a.src=url;a.volume=volume;a.loop=loop;a.obeyMuteSwitch=true;if(a.onError)a.onError(()=>{dispose(a);for(const [id,item] of loops)if(item===a)loops.delete(id);});return a;}
 function stopEffects(){for(const a of [...effects])dispose(a);}
 function fade(a,target,done){if(a._fade)clearInterval(a._fade);const start=Number(a.volume)||0;let tick=0;a._fade=setInterval(()=>{tick++;try{a.volume=start+(target-start)*tick/8;}catch{}if(tick>=8){clearInterval(a._fade);a._fade=null;if(done)done();}},40);if(a._fade.unref)a._fade.unref();}
 return {activate(){},play(id,url,volume){if(effects.size>=4)dispose(effects.values().next().value);const a=context(url,volume);if(!a)return;effects.add(a);if(a.onEnded)a.onEnded(()=>dispose(a));a.play();},
  environment(next){for(const [id,a] of loops){if(!next[id]||!next[id].gain){loops.delete(id);fading.add(a);fade(a,0,()=>dispose(a));}else fade(a,next[id].gain);}
   for(const [id,v] of Object.entries(next)){if(loops.has(id)||!v.gain)continue;const a=context(v.url,v.gain,true);if(a){loops.set(id,a);a.volume=0;a.play();fade(a,v.gain);}}
  },stopEffects,effectsVolume:stopEffects,suspend(){stopEffects();for(const a of loops.values())dispose(a);for(const a of [...fading])dispose(a);loops.clear();},destroy(){this.suspend();dead=true;}
 };
}
return {browser,native};
});
