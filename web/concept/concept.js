'use strict';
const stage=document.getElementById('stage'),main=document.getElementById('proposal');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const params=new URLSearchParams(location.search);if(params.has('single'))document.body.classList.add('single');
let data,view='home',index=0,history=[],auto=false,timer=null,revealTimer=null,currentText='',shown=0,selectedEnding='e1',lastFocus=null;
const expressionFrame={neutral:0,smile:0,worried:1,embarrassed:2,firm:3,hurt:4,relieved:5};
const exprStyle=expr=>{const i=expressionFrame[expr]??0;return `background-position:${i%3*50}% ${Math.floor(i/3)*100}%;`;};
function base(){return '<div class="scene-bg"></div><div class="scene-shade"></div>';}
function header(label){return `<div class="scene-header"><span class="location">${esc(label)}</span><button class="back" data-action="home" aria-label="返回首页">‹</button></div>`;}
function actor(expr){return `<div class="actor" style="${exprStyle(expr)}" role="img" aria-label="阿禾，${{neutral:'平静',smile:'微笑',worried:'担心',embarrassed:'脸红',firm:'认真',hurt:'难过',relieved:'释然'}[expr]||'微笑'}"></div>`;}
function stopAuto(){auto=false;clearTimeout(timer);timer=null;}
function cancelReveal(){clearInterval(revealTimer);revealTimer=null;}
function visibleLines(id){return data.scenes.find(s=>s.id===id).lines.filter(l=>!l.condition);}
function sample(){return visibleLines('c53').filter(l=>l.speaker==='阿禾'||l.speaker==='你').slice(3);}
function lineBox(speaker,text,reply=false){return `<section class="dialogue-box"><h2 class="speaker">${esc(speaker)}</h2><button class="line-body" data-action="advance" aria-label="显示完整台词或下一句">${esc(text)}</button><div class="dialogue-tools"><button data-action="history">回看</button>${reply?'':`<button data-action="auto" aria-pressed="${auto}">自动</button>`}<button class="advance" data-action="${reply?'ending':'advance'}">${reply?'读这个结尾':index>=sample().length-1?'查看选项稿':'下一句'} <span aria-hidden="true">◇</span></button></div></section>`;}
function render(){
 cancelReveal();document.body.classList.toggle('read-mode',view==='script');
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));
 document.querySelector('.reader')?.remove();
 if(view==='script'){renderScript();return;}
 stage.className='stage'+(view==='choice'?' choice-mode':view==='reply'?' reply-mode':'');
 if(view==='home')stage.innerHTML=base()+`<div class="title-mark"><span>一纸旧账，几程人间</span><h1>蜀地<br>钱路</h1></div><span class="seal">行商记</span><section class="home-bottom"><h2>灯下旧账</h2><p>你回来的那天，雨刚停。<br>有人替你买了饼，也替你留着一段路。</p><button class="enter" data-action="dialogue"><span>进入样章</span><span aria-hidden="true">◇</span></button><div class="quiet-row"><button class="quiet" data-action="script">读完整台本</button><button class="quiet" data-action="choice">看分支选项</button></div></section>`;
 if(view==='dialogue'){
  const l=sample()[index];stage.innerHTML=base()+header('桥头 · 夜雨')+actor(l.speaker==='阿禾'?l.expression:'worried')+lineBox(l.speaker,'');
  showLine(l.text);if(!history.length||history[history.length-1].id!==l.id)history.push(l);
 }
 if(view==='choice'){
  const c=data.scenes.find(s=>s.id==='c63').choice;
  stage.innerHTML=base()+header('下一程')+actor('worried')+`<section class="choice-box"><h2>「咱们呢？」<br>她看着你，等你回答。</h2><div class="choices">${c.options.map(o=>`<button data-choice="${o.id}">${esc(o.text)}</button>`).join('')}</div><button class="quiet" data-action="dialogue">回到对白</button></section>`;
 }
 if(view==='reply'){
  const l=history[history.length-1];stage.innerHTML=base()+header('下一程')+actor(l.expression)+lineBox('阿禾',l.text,true);
 }
}
function showLine(text){currentText=text;shown=0;const el=stage.querySelector('.line-body');if(!el)return;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){shown=text.length;el.textContent=text;queueAuto();return;}
 revealTimer=setInterval(()=>{shown=Math.min(text.length,shown+1);el.textContent=text.slice(0,shown);if(shown===text.length){cancelReveal();queueAuto();}},28);
}
function queueAuto(){clearTimeout(timer);if(auto&&view==='dialogue')timer=setTimeout(advance,Math.max(2200,currentText.length*90));}
function advance(){if(view==='reply')return readEnding();if(view!=='dialogue')return;if(shown<currentText.length){cancelReveal();shown=currentText.length;stage.querySelector('.line-body').textContent=currentText;queueAuto();return;}
 if(index<sample().length-1){index++;render();}else{stopAuto();view='choice';render();}}
function showHistory(){lastFocus=document.activeElement;stopAuto();cancelReveal();if(view==='dialogue'){shown=currentText.length;stage.querySelector('.line-body').textContent=currentText;}
 const overlay=document.createElement('section');overlay.className='overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','对话回看');
 overlay.innerHTML=`<div class="overlay-top"><h2>回看</h2><button class="back" data-action="close-history" aria-label="关闭回看">×</button></div><div class="overlay-body">${history.map(l=>`<div class="history-entry"><b>${esc(l.speaker)}</b>${esc(l.text)}</div>`).join('')}</div>`;stage.append(overlay);overlay.querySelector('button').focus();}
function closeHistory(){stage.querySelector('.overlay')?.remove();lastFocus?.focus();}
function renderScript(){
 const reader=document.createElement('article');reader.className='reader';reader.innerHTML=`<h1>灯下旧账</h1><p class="reader-intro">完整分支台本初稿。序章、六章与三个结尾。演出标记仅供审稿；正文与选项可继续修改。</p>`;
 const scenes=data.scenes.filter(s=>s.kind==='scene'),seen=new Set();
 const toc=document.createElement('nav');toc.className='reader-toc';toc.setAttribute('aria-label','台本章节');toc.innerHTML=scenes.filter(s=>{if(seen.has(s.chapter))return false;seen.add(s.chapter);return true;}).map(s=>`<a href="#${s.id}">${esc(s.chapter)}</a>`).join('');reader.append(toc);
 for(const s of scenes){const section=document.createElement('section');section.className='reading-scene';section.id=s.id;
  section.innerHTML=`<h2>${esc(s.chapter)}｜${esc(s.title)}</h2><div class="time">${esc(s.time)}</div>`+s.lines.map(l=>`<div class="script-line ${l.speaker==='旁白'?'narration':''} ${l.condition?'conditional':''}">${l.condition?`<div class="conditional-label">条件：${esc(Object.entries(l.condition).map(([k,v])=>k+'='+v).join('，'))}</div>`:''}<b>${esc(l.speaker)}</b>${!['旁白','你'].includes(l.speaker)?`<small>${esc(l.expression)}</small>`:''}：${esc(l.text)}</div>`).join('');
  if(s.choice){const choices=document.createElement('section');choices.className='reading-choice';choices.innerHTML=`<h3>${esc(s.choice.prompt)}</h3>`+s.choice.options.map(o=>{const branch=data.scenes.find(b=>b.id===o.target);return `<details class="branch-reading" open><summary>${esc(o.text)}</summary>${branch.lines.map(l=>`<p><b>${esc(l.speaker)}</b>：${esc(l.text)}</p>`).join('')}<small>后续节点：${esc(branch.next)}</small></details>`;}).join('');section.append(choices);}
  reader.append(section);
 }main.append(reader);
}
function switchView(next){stopAuto();cancelReveal();view=next;if(next==='dialogue'){index=0;history=[];}render();}
function readEnding(){switchView('script');requestAnimationFrame(()=>document.getElementById(selectedEnding)?.scrollIntoView());}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(stage.querySelector('.overlay')&&b.dataset.action!=='close-history')return;
 if(b.dataset.view)return switchView(b.dataset.view);
 if(b.dataset.choice){stopAuto();const o=data.scenes.find(s=>s.id==='c63').choice.options.find(o=>o.id===b.dataset.choice),branch=data.scenes.find(s=>s.id===o.target);selectedEnding=branch.next;history.push(branch.lines[branch.lines.length-1]);view='reply';render();return;}
 const a=b.dataset.action;if(['home','dialogue','choice','script'].includes(a))return switchView(a);
 if(a==='advance'){stopAuto();stage.querySelector('[data-action=auto]')?.setAttribute('aria-pressed','false');advance();}if(a==='ending')readEnding();if(a==='history')showHistory();if(a==='close-history')closeHistory();if(a==='auto'){auto=!auto;b.setAttribute('aria-pressed',String(auto));if(auto)queueAuto();else clearTimeout(timer);}
});
document.addEventListener('keydown',e=>{const overlay=stage.querySelector('.overlay');if(overlay){if(e.key==='Escape'){e.preventDefault();closeHistory();}if(e.key==='Tab'){e.preventDefault();overlay.querySelector('button').focus();}return;}if((e.key===' '||e.key==='Enter')&&!['BUTTON','A'].includes(document.activeElement.tagName)&&view==='dialogue'){e.preventDefault();advance();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAuto();stage.querySelector('[data-action=auto]')?.setAttribute('aria-pressed','false');}});
fetch('story.json').then(r=>{if(!r.ok)throw Error('台本未载入');return r.json();}).then(d=>{data=d;const wanted=params.get('view');switchView(['home','dialogue','choice','script'].includes(wanted)?wanted:'home');}).catch(()=>{stage.innerHTML='<section class="overlay"><h2>台本未载入</h2><p>请刷新本地预览页面。</p><button onclick="location.reload()">刷新</button></section>';});
