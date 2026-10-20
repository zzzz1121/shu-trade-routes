const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const output='outputs/portraits-0.4.15';
(async()=>{fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch({channel:'chrome'});try{
 for(const [width,height] of [[375,667],[375,812],[390,844],[430,932]]){
  const p=await browser.newPage({viewport:{width,height}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
  await p.goto('http://127.0.0.1:4173/?v=0.4.15');
  for(const id of ['embark','chapter-open:l01','opening-start','object:greeting'])await p.locator('[data-action="'+id+'"]').click();
  for(const name of ['阿禾','罗掌柜','许掌柜','沈娘子']){
   let baseline;
   for(const emotion of ['neutral','smile','thinking','puzzled','worried','firm']){
    const r=await p.evaluate(async({name,emotion})=>{
     const v=ShuStoryView.decorate(ShuNarrative.decorate(ShuScene.decorate(game.view()))),a=ShuNarrative.actor(name,'/miniapp/assets',emotion);
     v.modal.actor=a;v.modal.stageActor=a;v.modal.stageSilent=false;v.modal.title=name;v.modal.body='这一路，先核对货单，再看看布包上的记号。';
     root.innerHTML=storyPlay(v)+storyModal(v);const e=document.querySelector('.vn-cast'),i=e.querySelector('img');await i.decode();
     const box=x=>{const r=x.getBoundingClientRect();return [r.x,r.y,r.width,r.height];},rect=box(e),cell=box(e.querySelector('.actor-cell')),img=box(i);
     const outside=[...document.querySelectorAll('.vn-cast,.vn-dialog,.vn-toolbar,.vn-choices button')].filter(x=>{const r=x.getBoundingClientRect();return r.x<-.5||r.y<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5;}).map(e=>e.className);
     return {rect,cell,img,outside,src:i.src,ratio:i.naturalWidth/i.naturalHeight,count:e.querySelectorAll('img').length};
    },{name,emotion});
    assert.equal(r.count,1);assert.deepEqual(r.outside,[]);assert.deepEqual(r.cell,r.img,'image enlarged or offset inside crop');assert.ok(Math.abs(r.rect[2]/r.rect[3]-r.ratio)<.001,'distorted portrait');assert.ok(r.src.endsWith('/'+emotion+'.png'));
    if(!baseline)baseline=r.rect;else assert.deepEqual(r.rect,baseline,'expression moved actor');
    if(width===390)await p.screenshot({path:output+'/'+({'阿禾':'ahe','罗掌柜':'luo','许掌柜':'xu','沈娘子':'shen'}[name])+'-'+emotion+'.png'});
   }
  }
  // Real dialogue with long copy and choices must not move the actor stage.
  await p.evaluate(()=>render());const rect=()=>p.locator('.vn-cast').evaluate(e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height];});const before=await rect();
  for(const variant of ['long','choices']){await p.evaluate(variant=>{const v=ShuStoryView.decorate(ShuNarrative.decorate(ShuScene.decorate(game.view())));if(variant==='long')v.modal.body='先核对货单，再看看布包上的记号。走哪条路，得留意手里的铁钱。'.repeat(2);else{v.modal.atEnd=true;v.modal.choices=[{id:'a',label:'先看看货单'},{id:'b',label:'再问问阿禾'}];}root.innerHTML=storyPlay(v)+storyModal(v);},variant);assert.deepEqual(await rect(),before);}
  assert.deepEqual(errors,[]);await p.close();console.log('PASS all 24 portraits, expression switch, dialogue bounds '+width+'x'+height);
 }
 // Check actual alpha and clear edges of every asset, not just PNG format.
 const p=await browser.newPage();await p.goto('http://127.0.0.1:4173');const alpha=await p.evaluate(async()=>{const out=[];for(const name of ['阿禾','罗掌柜','许掌柜','沈娘子'])for(const emotion of ['neutral','smile','thinking','puzzled','worried','firm']){const a=ShuNarrative.actor(name,'/miniapp/assets',emotion),i=new Image();i.src=a.portrait;await i.decode();const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);const d=x.getImageData(0,0,c.width,c.height).data;let clear=0,edgeInk=0;for(let y=0;y<c.height;y++)for(let xx=0;xx<c.width;xx++){const aa=d[(y*c.width+xx)*4+3];if(aa===0)clear++;if((y<2||xx<2||xx>=c.width-2)&&aa>200)edgeInk++;}out.push({name,emotion,clear:clear/(c.width*c.height),edgeInk});}return out;});for(const a of alpha){assert.ok(a.clear>.1,JSON.stringify(a));assert.ok(a.edgeInk<20,'silhouette cut at top/side: '+JSON.stringify(a));}console.log('PASS 24 alpha backgrounds / unclipped top and side edges');
await p.setViewportSize({width:390,height:844});const click=id=>p.locator('[data-action="'+id+'"]').first().click();
for(const id of ['embark','chapter-open:l01','opening-start','object:greeting'])await click(id);
for(let j=0;j<3;j++)await click('dialogue-next');await click('object:enter');for(let j=0;j<2;j++)await click('dialogue-next');await click('choice:ask');
assert.equal(await p.locator('.vn-text').innerText(),'肯问就行，别跟钱袋较劲。');assert.ok((await p.locator('.vn-cast img').getAttribute('src')).endsWith('/ahe/smile.png'));await p.locator('.vn-cast img').evaluate(i=>i.decode());await p.screenshot({path:output+'/reported-scene-fixed.png'});console.log('PASS reported scene: correct smile, independent image');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
