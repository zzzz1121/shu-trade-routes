(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ShuStoryScenes=factory();})(this,function(){
'use strict';
// Scene art is presentation only. Never use it to determine position or charge steps.
const files={P00_01_GATE:'art-v34/market-lane.png',P00_02_AHE:'art-v34/market-lane.png',P00_03_LUO:'art-v34/merchant-room.png',P00_04_FRONT_DESK:'art-v34/merchant-room.png',P01_01_WAREHOUSE:'art-v34/warehouse-counter.png',P01_02_EXCHANGE_INTRO:'art-v34/warehouse-counter.png',P01_03_ROAD_FORK:'art-v34/market-lane.png',P01_04_BRIDGE:'art-v34/market-lane.png',P01_04_STREET:'art-v34/market-lane.png',P01_04_BACK_ALLEY:'art-v34/market-lane.png',P01_05_SHEN_SHOP:'art-v34/cloth-shop.png',P01_06_BOUGHT:'art-v34/cloth-shop.png',P01_07_DELIVERY_APPROACH:'art-v34/market-lane.png',P01_08_DELIVERED:'art-v34/merchant-room.png',P01_09_LEDGER:'art-v34/merchant-room.png',P01_10_AFTER_MARKET:'story-v36/luo-dusk.png'};
const aliases={think:'thinking',serious:'firm'};
function background(id,base='/miniapp/assets'){return base+'/'+(files[id]||files.P00_01_GATE);}
function expression(value){return aliases[value]||(['neutral','smile','thinking','puzzled','worried','firm'].includes(value)?value:'neutral');}
return {files,background,expression};
});
