(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ShuNarrative=factory();})(this,function(){
'use strict';
// Presentation-only story and art references. Prices, goals and routes come from the level.
const characters={
 '阿禾':{id:'ahe',role:'年轻行商'},
 '罗掌柜':{id:'luo',role:'商行掌柜'},
 '许掌柜':{id:'xu',role:'许记掌柜'}
};
const chapters={
 l01:{tag:'初入商路',subtitle:'一袋铁钱，一份托付',line:'晨光落在布幌上，第一笔委托等你启程。',crop:'78% 42%',opening:'布铺替我留了一匹好布。阿禾，劳你买回来，送到商行。'},
 l02:{tag:'街市采买',subtitle:'先买哪样，也是一笔账',line:'粮香混着药香，两家铺子都开了门。',crop:'28% 68%',opening:'粮食和药材都等着用。两家收钱的规矩不同，你一路多留个心。'},
 l03:{tag:'商号信用',subtitle:'同一张票，不同的门',line:'走到市口，才知道一张交子未必处处通行。',crop:'84% 45%',opening:'东市认这张票，西市却摇头。先问清商号，再决定往哪边走。'},
 l04:{tag:'买卖周转',subtitle:'茶货出手，布匹入袋',line:'茶香还在行囊里，下一笔生意已经有了着落。',crop:'10% 48%',opening:'这包茶先替我出手，再捎一匹布回来。收什么钱、走哪条路，就交给你了。'},
 l05:{tag:'纸券与现钱',subtitle:'兑现之前，再算一算',line:'许记门前有人等候，柜上的铁钱却不多了。',crop:'74% 82%',opening:'今日柜上现钱不多，兑付得有个限度。你要买纸墨，先看看两市的价。'},
 l06:{tag:'再度启程',subtitle:'新纸券，老生意',line:'新交子到了街市，熟悉的商路又热闹起来。',crop:'45% 20%',opening:'还记得头一回送布吗？如今换了新交子，布料和茶货这两笔买卖，托你办了。'}
};
function actor(name,base){const c=characters[name]||characters['阿禾'];return {name:characters[name]?name:'阿禾',role:c.role,portrait:base+'/characters/'+c.id+'.png'};}
function decorate(v,base='/miniapp/assets'){
 const n=chapters[v.level.id];v.narrative=Object.assign({},n,{speaker:actor(v.level.intro[0],base),scene:base+'/approved/town-atlas.png'});
 v.completedCount=v.chapters.filter(c=>c.completed).length;v.chapterCount=v.chapters.length;
 v.chapters=v.chapters.map(c=>{const crop=chapters[c.id].crop.split(' ').map(parseFloat);return Object.assign({},c,chapters[c.id],{scene:base+'/approved/town-atlas.png',artStyle:'left:'+(-crop[0]*1.2)+'%;top:'+(-crop[1]*1.2)+'%;'});});
 v.currentChapter=v.chapters.find(c=>c.id===v.level.id);
 v.journeyStatus=v.currentChapter.completed?'这笔委托已办妥，随时可以重走商路。':'委托已备好，等你启程。';
 v.guide=actor('阿禾',base);
 v.outroActor=actor(v.s.status==='won'?v.level.outro[0]:'阿禾',base);
 v.outroText=v.s.status==='won'?v.level.outro[1]:'这笔账还可以重算。退回上一步，我们换个走法。';
 if(v.modal){const m=v.modal;
  m.dialogue=['lesson','story'].includes(m.kind);m.important=m.kind==='story';
  if(m.dialogue){m.actor=actor(m.title,base);if(!characters[m.title])m.body=m.title+'说：“'+m.body+'”';if(m.kind==='story')m.body=n.opening;m.title=m.actor.name;}
  if(m.kind==='move'){
   const node=v.level.nodes.find(x=>x.id===m.nodeId),trade=v.level.transactions.find(t=>t.nodeId===m.nodeId);
   m.flavor=node.toll?'路近些，过路钱可要先备好。':node.id==='warehouse'?'阿禾：先把钱袋理好，出门心里才有数。':node.id===v.level.goal?'掌柜正在商行等着这批货。':trade&&trade.type==='redeem'?'许掌柜：柜上现钱有限，兑多少，先想好。':trade&&trade.type==='swap'?'许掌柜：换张票，也要看看下一家认不认。':/grain/.test(node.id)?'新粮刚入仓，粮商正候着买主。':/medicine/.test(node.id)?'药香飘出门帘，药铺今日照常开张。':trade?'先问清收钱的规矩，再落定这笔买卖。':'街巷相通，走远些，也有走远些的好处。';
  }
 }
 return v;
}
return {decorate,characters,chapters};
});
