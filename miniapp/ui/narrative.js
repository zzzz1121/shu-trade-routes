(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ShuNarrative=factory();})(this,function(){
'use strict';
// Presentation-only story and art references. Prices, goals and routes come from the level.
const characters={
 '阿禾':{id:'ahe',role:'年轻行商'},
 '罗掌柜':{id:'luo',role:'商行掌柜'},
 '许掌柜':{id:'xu',role:'许记掌柜'},
 '沈娘子':{id:'shen',role:'布铺掌柜'}
};
const chapters={
 l01:{tag:'初入商路',subtitle:'一袋铁钱，一份托付',line:'晨光落在布幌上，第一笔委托等你启程。',crop:'78% 42%',opening:'布铺替我留了一匹好布。阿禾，劳你买回来，送到商行。'},
 l02:{tag:'街市采买',subtitle:'先买哪样，也是一笔账',line:'粮香混着药香，两家铺子都开了门。',crop:'28% 68%',opening:'粮食和药材都等着用。两家收钱的规矩不同，你一路多留个心。'},
 l03:{tag:'商号信用',subtitle:'同一张票，不同的门',line:'走到市口，才知道一张交子未必处处通行。',crop:'84% 45%',opening:'东市认这张票，西市却摇头。先问清商号，再决定往哪边走。'},
 l04:{tag:'买卖周转',subtitle:'茶货出手，布匹入袋',line:'茶香还在行囊里，下一笔生意已经有了着落。',crop:'10% 48%',opening:'这包茶先替我出手，再捎一匹布回来。收什么钱、走哪条路，就交给你了。'},
 l05:{tag:'纸券与现钱',subtitle:'兑现之前，再算一算',line:'许记门前有人等候，柜上的铁钱却不多了。',crop:'74% 82%',opening:'今日柜上现钱不多，兑付得有个限度。你要买纸墨，先看看两市的价。'},
 l06:{tag:'再度启程',subtitle:'新纸券，老生意',line:'新交子到了街市，熟悉的商路又热闹起来。',crop:'45% 20%',opening:'还记得头一回送布吗？如今换了新交子，布料和茶货这两笔买卖，托你办了。'}
};
// Historical facts paraphrased from the sources recorded in docs/history-sources.md.
// Spoken by fictional characters; never used as transaction or route rules.
const historyFragments={
 l01:'铁钱这样沉，做买卖难免费力。蜀地的交子，正是因携钱不便而兴起的。',
 l02:'交子通行以后，铁钱也没退出街市。轻便的纸券和现钱，在蜀地并行流通。',
 l03:'最初办交子的，是民间铺户。人们肯收这张纸，靠的是对铺户与商号的信任。',
 l04:'蜀地茶货往来兴旺，交子也用在茶商的大额交易中。这张轻纸，跟着生意走了很远。',
 l05:'交子得能兑成钱，才有人放心收。早年的铺户也遇过兑付困难，甚至引起争讼。',
 l06:'天圣元年，官府设了益州交子务；次年，官交子开始发行。街市用的钱，又有了新章程。'
};
const stops=[[26,16],[74,28],[26,44],[74,56],[26,72],[74,84]];
// Generated sheets have measured frame bounds; align emotion changes to one hairline.
const artSprites={ahe:{version:'v34',aspect:'0.444444',cellHeight:768,tops:[74,74,73,24,23,22]},luo:{version:'v34',aspect:'1',cellHeight:512,tops:[7,12,14,1,2,0]},shen:{version:'v34',aspect:'1',cellHeight:512,tops:[8,8,9,5,6,6]}};
const expressions=['neutral','smile','thinking','puzzled','worried','firm'];
function actor(name,base,expression='neutral',pose='idle'){
 if(['你','玩家','旁白','守桥人'].includes(name))return {name,visible:false,expression,pose,role:'',portrait:'',frameStyle:'',aspectStyle:''};
 const c=characters[name]||characters['阿禾'],emotion=Math.max(0,expressions.indexOf(expression));
 const index=c.id==='luo'?[0,4,2,1,3,5][emotion]:c.id==='shen'?[0,1,3,3,4,2][emotion]:emotion;
 const sprite=artSprites[c.id]||{version:'v3',aspect:'1'},align=sprite.tops?(sprite.tops[0]-sprite.tops[index])/sprite.cellHeight*100:0;
 return {id:c.id,name:characters[name]?name:'阿禾',role:c.role,expression:expressions[emotion],pose,aspectStyle:'aspect-ratio:'+sprite.aspect+';',portrait:base+'/characters/'+sprite.version+'/'+c.id+'-expressions.png',frameStyle:'left:'+(-(index%3)*100)+'%;top:'+(-Math.floor(index/3)*100+align)+'%;'};
}
function decorate(v,base='/miniapp/assets'){
 const n=chapters[v.level.id];v.narrative=Object.assign({},n,{speaker:actor(v.level.intro[0],base),scene:base+'/chapters/chapter-scenes.png',sceneStyle:'left:'+(-((v.level.number-1)%3)*100)+'%;top:'+(-Math.floor((v.level.number-1)/3)*100)+'%;'});
 v.completedCount=v.chapters.filter(c=>c.completed).length;v.chapterCount=v.chapters.length;
 v.chapterBackdrop=base+'/v2/terrain.png';
 v.chapters=v.chapters.map((c,i)=>Object.assign({},c,chapters[c.id],{
  scene:base+'/chapters/chapter-scenes.png',artStyle:'left:'+(-(i%3)*100)+'%;top:'+(-Math.floor(i/3)*100)+'%;',
  positionStyle:'left:'+stops[i][0]+'%;top:'+stops[i][1]+'%;',active:!c.locked&&!c.completed
 }));
 // Connecting the chapter journey is presentation only, separate from the playable maps.
 v.chapterRoads=stops.slice(1).map((b,i)=>{const a=stops[i],dx=b[0]-a[0],dy=b[1]-a[1];return {id:i,done:v.chapters[i].completed,style:'left:'+a[0]+'%;top:'+a[1]+'%;width:'+Math.abs(dx)+'%;height:'+Math.abs(dy)+'%;',reverse:dx<0};});
 v.currentChapter=v.chapters.find(c=>c.id===v.level.id);
 v.journeyStatus=v.resumeSummary|| (v.currentChapter.completed?'这笔委托已办妥，随时可以重走商路。':'委托已备好，等你启程。');
 v.guide=actor('阿禾',base);
 v.backlog=v.backlog.map(line=>Object.assign({},line,{actor:actor(line.speaker,base,line.expression,line.pose)}));
 v.outroActor=actor(v.s.status==='won'?v.level.outro[0]:'阿禾',base,v.s.status==='won'?'smile':'worried');
 v.historyLine=v.s.status==='won'?historyFragments[v.level.id]:'';
 v.outroText=v.s.status==='won'?({l01:'布料送到了，正好赶上裁衣。工钱在这里，先歇歇脚。',l02:'粮食和药材都齐了。把袋子放这儿，我来收拾。',l03:'货买回来了。这一路，哪家认哪张票，你也摸清了。',l04:'茶卖出去，布也带回来了。这趟来回，辛苦你了。',l05:'纸墨买到了。柜上兑出的数，我都记好了，你再对一对。',l06:'布和茶都到了。还记得头一回送布么？这回可熟练多了。'}[v.level.id]||v.level.outro[1]):'这笔账还可以重算。退回上一步，我们换个走法。';
 if(v.modal){const m=v.modal;
  m.dialogue=['lesson','story','hint'].includes(m.kind);m.important=m.kind==='story';
  if(m.dialogue){m.actor=actor(m.line?m.line.speaker:m.kind==='hint'?'阿禾':m.title,base,m.line?m.line.expression:'neutral',m.line?m.line.pose:'idle');if(m.source!=='v4'&&m.kind!=='hint'&&!characters[m.title])m.body=m.title+'说：“'+m.body+'”';m.title=m.actor.name;if(m.kind==='story'){m.atEnd=m.cursor===m.lines.length-1;m.count=m.lines.length;}}
  if(m.source==='v4'){const previous=v.backlog.slice().reverse().find(line=>characters[line.speaker]);m.stageActor=m.actor.visible!==false?m.actor:previous?actor(previous.speaker,base,previous.expression,'idle'):null;m.stageSilent=m.actor.visible===false;}
  if(m.kind==='history'){m.title=['钱袋为什么这样沉','纸券与现钱','谁愿意认这张纸','跟着茶货走','柜上的现钱','新交子'][m.page];m.body=Object.values(historyFragments)[m.page];m.count=6;}
  if(m.kind==='move'){m.actor=actor('阿禾',base);
   const node=v.level.nodes.find(x=>x.id===m.nodeId),trade=v.level.transactions.find(t=>t.nodeId===m.nodeId);
   m.flavor=node.toll?'过桥需 '+node.toll+' 铁钱，走这条路前先留好。':node.id==='warehouse'?'阿禾：先把钱袋理好，出门心里才有数。':node.id===v.level.goal?'掌柜正在商行等着这批货。':trade&&trade.type==='redeem'?'许掌柜：柜上现钱有限，兑多少，先想好。':trade&&trade.type==='swap'?'许掌柜：换张票，也要看看下一家认不认。':/grain/.test(node.id)?'新粮刚入仓，粮商正候着买主。':/medicine/.test(node.id)?'药香飘出门帘，药铺今日照常开张。':trade?'先问清收钱的规矩，再落定这笔买卖。':'街巷相通，走远些，也有走远些的好处。';
  }
 }
 return v;
}
return {decorate,actor,characters,chapters,historyFragments};
});
