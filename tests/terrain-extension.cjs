const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});const page=await browser.newPage();
for(const [width,height] of [[375,812],[390,844],[430,932]]){
 await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4173');await page.evaluate(()=>localStorage.clear());await page.reload();await page.locator('[data-action=start]').click();await page.locator('[data-action=skip-intro]').click();await page.locator('.continuation-art').evaluate(i=>i.decode());
 const m=await page.evaluate(()=>{const stage=document.querySelector('.map-stage').getBoundingClientRect(),art=document.querySelector('.continuation-art').getBoundingClientRect(),map=document.querySelector('.reference-map').getBoundingClientRect(),header=document.querySelector('.topbar').getBoundingClientRect(),dock=document.querySelector('.dock').getBoundingClientRect();return {stage:{top:stage.top,bottom:stage.bottom,left:stage.left,right:stage.right},art:{top:art.top,bottom:art.bottom,left:art.left,right:art.right},map:{width:map.width,height:map.height},headerBottom:header.bottom,dockTop:dock.top,pointer:getComputedStyle(document.querySelector('.scene-continuation')).pointerEvents};});
 assert.ok(m.art.top<=m.stage.top&&m.art.bottom>=m.stage.bottom&&m.art.left<=m.stage.left&&m.art.right>=m.stage.right,'extension covers stage');assert.ok(m.stage.top<=m.headerBottom+1&&m.stage.bottom>=m.dockTop,'no blank bands between panels');assert.ok(Math.abs(m.map.width/m.map.height-634/522)<.002,'town aspect ratio preserved');assert.equal(m.pointer,'none');
 await page.screenshot({path:`outputs/extended-scene-${width}.png`});if(width===390)await page.locator('.map-stage').screenshot({path:'outputs/extended-map-preview.png'});
 console.log('PASS terrain coverage, aspect ratio, pointer passthrough',width,height);
}
await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
