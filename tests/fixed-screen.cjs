const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
async function action(a){await page.locator(`[data-action="${a}"]`).click();}
async function check(label){const d=await page.evaluate(()=>({height:innerHeight,width:innerWidth,bodyH:document.body.scrollHeight,docH:document.documentElement.scrollHeight,docW:document.documentElement.scrollWidth,over:[...document.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect();return r.width&&r.height&&(r.bottom>innerHeight+1||r.top<0||r.left<0||r.right>innerWidth+1)}).map(b=>b.textContent)}));assert.ok(d.docH<=d.height&&d.bodyH<=d.height&&d.docW<=d.width,`${label}: document overflow ${JSON.stringify(d)}`);assert.deepEqual(d.over,[],`${label}: inaccessible controls`);await page.mouse.wheel(0,700);assert.equal(await page.evaluate(()=>scrollY),0,label+' scroll');}
for(const [width,height] of [[375,812],[390,844],[430,932]]){
 await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4173');await check('home');if(width===390)await page.screenshot({path:'outputs/home-preview.png'});await action('intro');await check('intro');await action('play');await check('prepare');
 await page.screenshot({path:`outputs/fixed-prepare-${width}.png`});if(width===390){await page.screenshot({path:'outputs/game-preview.png'});await page.locator('.reference-map').screenshot({path:'outputs/approved-map-preview.png'});}
 assert.equal(await page.locator('[data-action=depart]').isDisabled(),true);
 // Current site opens its panel, and wrong-site movement is rejected without spending steps.
 await page.locator('[data-node=warehouse]').click();assert.match(await page.locator('.feedback').innerText(),/当前位于货仓/);
 await page.locator('[data-node=shop]').click();assert.match(await page.locator('.feedback').innerText(),/确认出发/);
 await action('rules');await check('rules 1');await action('rule-next');await check('rules 2');await action('rule-next');await check('rules 3');await page.getByRole('button',{name:'返回游戏'}).click();
 await action('x+');await action('x+');await action('exchange');await check('exchanged');await action('depart');await check('departed');
 // Hit the building itself, not an oversized transparent proxy above the label.
 await page.locator('[data-building=bridge]').click({position:{x:65,y:80}});assert.match(await page.locator('.feedback').innerText(),/过桥 −1/);
 await page.locator('[data-node=bridge] .scene-placard').click();assert.match(await page.locator('.feedback').innerText(),/当前位于收费桥/);
 await page.locator('[data-node=shop]').click();await check('trade');await page.screenshot({path:`outputs/fixed-trade-${width}.png`});
 await action('p-');assert.equal(await page.locator('[data-action=buy]').isDisabled(),true);await action('p+');await action('buy');await check('bought');
 await page.locator('[data-node=delivery]').click();await check('delivery');await action('deliver');await check('won');if(width===390)await page.screenshot({path:'outputs/success-preview.png'});assert.equal(await page.getByRole('heading',{name:'布已送达'}).count(),1);
 await action('undo');await check('undo success');await action('retry');await action('x+');await action('x+');await action('exchange');await action('depart');
 for(const n of ['street','alley','shop'])await page.locator(`[data-node=${n}]`).click();await action('buy');await page.locator('[data-node=delivery]').click();await action('deliver');assert.equal(await page.getByText('1 铁钱 · 0 交子',{exact:true}).count(),1);
 await action('retry');await action('exchange');await action('depart');for(const n of ['street','warehouse','street','alley'])await page.locator(`[data-node=${n}]`).click();await check('failed');assert.equal(await page.getByRole('heading',{name:'行程未成'}).count(),1);await action('undo');await check('undo failure');
}
assert.deepEqual(errors,[]);console.log('PASS: 3 phone sizes × home/intro/preparation/exchange/travel/trade/delivery/win/failure/undo/rules; no scrolling, every control on screen, A/B paths, real building hit, current-node behavior, payment bounds.');await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
