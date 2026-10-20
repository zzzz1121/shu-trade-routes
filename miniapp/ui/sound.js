(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./sound-catalog'));else root.ShuSound=factory(root.ShuSoundCatalog);})(this,function(Catalog){
'use strict';
const KEY='shu-audio-settings-v1',defaults={musicEnabled:true,musicVolume:.45,effectsEnabled:true,ambienceEnabled:true,volume:.55,effectsVolume:.75,ambienceVolume:.5};
const clamp=n=>Math.max(0,Math.min(1,n));
function settings(data){const out=Object.assign({},defaults);if(data&&data.version===1){for(const key of ['effectsEnabled','ambienceEnabled','musicEnabled'])if(typeof data[key]==='boolean')out[key]=data[key];for(const key of ['volume','effectsVolume','ambienceVolume','musicVolume'])if(Number.isFinite(data[key]))out[key]=clamp(data[key]);}return out;}
function create(options={}){
 const backend=options.backend||{},timer=options.setTimeout||setTimeout,clear=options.clearTimeout||clearTimeout,now=options.now||Date.now,last={},pending=new Set();
 let config;try{config=settings(options.read&&options.read(KEY));}catch{config=settings(null);}let active=false,unlocked=false,scene=null,disposed=false;
 const base=options.base||'/miniapp/assets/audio',storageWrite=options.write;
 function invoke(method,...args){try{const result=backend[method]&&backend[method](...args);if(result&&result.catch)result.catch(()=>{});}catch{} }
 function mix(){const layers={};if(active&&unlocked&&scene&&scene.map&&config.ambienceEnabled){const duck=scene.dialogue ? .42 : scene.modal ? .6 : 1;layers['ambience.market']=.75*duck;layers['ambience.water']=(scene.bridge ? .85 : .16)*duck;layers['ambience.paper']=(scene.paper ? .6 : 0)*duck;}const voices={};if(active&&unlocked&&scene&&scene.music&&config.musicEnabled){const id='music.'+(scene.music||'market');if(Catalog.entries[id])voices[id]={url:base+'/'+Catalog.entries[id].file,gain:Catalog.entries[id].gain*config.volume*config.musicVolume*(scene.dialogue?.35:scene.modal?.6:1)};}for(const id of Object.keys(layers))voices[id]={url:base+'/'+Catalog.entries[id].file,gain:layers[id]*Catalog.entries[id].gain*config.volume*config.ambienceVolume};invoke('environment',voices);}
 function cancel(){for(const id of pending)clear(id);pending.clear();invoke('stopEffects');}
 function configure(patch,options={}){for(const key of ['effectsEnabled','ambienceEnabled','musicEnabled'])if(typeof patch[key]==='boolean')config[key]=patch[key];for(const key of ['volume','effectsVolume','ambienceVolume','musicVolume'])if(Number.isFinite(patch[key]))config[key]=clamp(patch[key]);if(!config.effectsEnabled||config.volume===0||config.effectsVolume===0)cancel();else invoke('effectsVolume',config.volume*config.effectsVolume);mix();try{if(options.persist!==false&&storageWrite)storageWrite(KEY,Object.assign({version:1},config));}catch{}return getSettings();}
 function getSettings(){return Object.assign({},config);}
 function play(id){const cue=Catalog.entries[id],time=now();if(disposed||!active||!unlocked||!config.effectsEnabled||!cue||cue.gain<=0||cue.loop||!config.volume||!config.effectsVolume)return false;if(last[id]!==undefined&&time-last[id]<(cue.cooldown||150))return false;last[id]=time;invoke('play',id,base+'/'+cue.file,cue.gain*config.volume*config.effectsVolume);return true;}
 function sequence(ids,spacing=140){if(!active||!unlocked||!config.effectsEnabled)return;ids.slice(0,6).forEach((id,i)=>{if(!i){play(id);return;}if(pending.size>=16)return;const handle=timer(()=>{pending.delete(handle);play(id);},i*spacing);pending.add(handle);});}
 return {play,sequence,cancel,configure,getSettings,resetPreferences:()=>configure(defaults,{persist:false}),setVolume:(value,channel='master')=>configure({[{master:'volume',effects:'effectsVolume',ambience:'ambienceVolume',music:'musicVolume'}[channel]||'volume']:value}),
  activate(){if(disposed)return;unlocked=true;active=true;invoke('activate');mix();},
  scene(value){scene=value;mix();},suspend(){active=false;cancel();invoke('suspend');mix();},
  resume(){if(unlocked&&!disposed){active=true;invoke('activate');mix();}},
  destroy(){disposed=true;active=false;cancel();invoke('environment',{});invoke('destroy');},
  get state(){return {active,unlocked,pending:pending.size};}
 };
}
return {create,settings,defaults,KEY};
});
