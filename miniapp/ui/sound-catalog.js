(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ShuSoundCatalog=factory();})(this,function(){
'use strict';
// Original procedural stand-ins, not field recordings. Replace file paths here.
const entries={
 'music.market':{file:'music-market.wav',loop:true,gain:.44},
 'music.old-note':{file:'music-old-note.wav',loop:true,gain:.4},
 'music.homecoming':{file:'music-homecoming.wav',loop:true,gain:.44},
 'prop.box':{file:'prop-box.wav',gain:.35,cooldown:450},
 'prop.paper':{file:'prop-paper.wav',gain:.25,cooldown:300},
 'prop.cloth':{file:'prop-cloth.wav',gain:.3,cooldown:350},
 'ambience.market':{file:'ambience-market.wav',loop:true,gain:.38},
 'ambience.water':{file:'ambience-water.wav',loop:true,gain:.3},
 'ambience.paper':{file:'ambience-paper.wav',loop:true,gain:.22},
 'move.step':{file:'step-earth.wav',gain:.46,cooldown:130},
 'move.bridge':{file:'step-wood.wav',gain:.4,cooldown:130},
 'move.arrive':{file:'arrive.wav',gain:.28,cooldown:180},
 'ui.click':{file:'ui-click-paper.wav',gain:.18,cooldown:160},
 'ui.page':{file:'ui-page.wav',gain:.35,cooldown:180},
 'ui.dialogue':{file:'ui-dialogue.wav',gain:.32,cooldown:180},
 'ui.continue':{file:'ui-continue.wav',gain:.27,cooldown:100},
 'trade.exchange':{file:'exchange.wav',gain:.44,cooldown:350},
 'trade.iron':{file:'pay-iron.wav',gain:.42,cooldown:250},
 'trade.note':{file:'pay-note.wav',gain:.4,cooldown:250},
 'trade.purchase':{file:'purchase.wav',gain:.34,cooldown:300},
 'trade.delivery':{file:'delivery.wav',gain:.42,cooldown:500},
 'system.error':{file:'error.wav',gain:.34,cooldown:500},
 'system.win':{file:'win.wav',gain:.4,cooldown:700},
 'system.unlock':{file:'unlock.wav',gain:.3,cooldown:700}
};
return {entries,source:'original-procedural-placeholder',version:1};
});
