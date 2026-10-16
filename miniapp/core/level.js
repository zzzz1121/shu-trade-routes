(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ShuLevel=factory();})(this,function(){
'use strict';
const node=(id,name,x,y,art,toll=0)=>({id,name,x,y,art,toll});
const buy=(id,nodeId,cargo,price,minIron=0,minNote=0,issuer='a')=>({id,nodeId,type:'buy',cargo,quantity:1,price,minIron,minNote,issuer,accepts:issuer?[issuer]:[]});
const all=[{
 id:'l01',number:1,title:'布匹之约',mission:'购买布料，送至商行',capacity:5,maxSteps:4,start:'warehouse',goal:'delivery',issuer:'a',
 initial:{warehouseIron:8,iron:0,notes:{},cargo:{}},exchange:{fee:1,min:2,issuer:'a'},goods:{cloth:{name:'布料',weight:2,icon:7}},
 nodes:[node('warehouse','货仓',22,47,0),node('bridge','收费桥',43,24,2,1),node('street','街巷',27,75,3),node('alley','后巷',49,82,3),node('shop','布铺',77,50,1),node('delivery','交付商行',80,86,4)],
 edges:[['warehouse','bridge'],['bridge','shop'],['warehouse','street'],['street','alley'],['alley','shop'],['shop','delivery']],
 transactions:[buy('buy-cloth','shop','cloth',6,2)],target:{cargo:{cloth:1},transactions:['buy-cloth']},
 intro:['罗掌柜','布铺留了一批布，替我买回来，再送到商行。'],outro:['罗掌柜','不错，这笔生意办成了。下回可不止买一样东西。'],
 hints:['想想怎样减少随身铁钱的重量。','兑换一些交子，但要留足布铺收的铁钱。','可先把 5 铁钱换成 4 交子；走桥后付 2 铁钱和 4 交子买布，再去商行。'],
 lessons:{money:['阿禾','货款有八份铁钱，钱袋只能装五格。'],exchange:['阿禾','交子拿着轻便，不过兑换也要花钱。'],route:['阿禾','走桥快，要付钱；绕路慢，不收费。'],shop:['布商','至少给我两份铁钱，其余可以用交子。']}
},{
 id:'l02',number:2,title:'两笔买卖',mission:'买齐粮食与药材，送至商行',capacity:5,maxSteps:4,start:'warehouse',goal:'delivery',issuer:'a',
 initial:{iron:5,notes:{a:4},cargo:{}},goods:{grain:{name:'粮食',weight:3,icon:0},medicine:{name:'药材',weight:1,icon:1}},
 nodes:[node('warehouse','货仓',20,30,0),node('grain_shop','粮商',72,31,1),node('medicine_shop','药铺',28,60,1),node('side_street','街尾',78,63,3),node('delivery','交付商行',55,89,4)],
 edges:[['warehouse','grain_shop'],['grain_shop','medicine_shop'],['medicine_shop','delivery'],['warehouse','medicine_shop'],['grain_shop','side_street'],['side_street','delivery']],
 transactions:[buy('buy-grain','grain_shop','grain',4,3),buy('buy-medicine','medicine_shop','medicine',4,0,3)],target:{cargo:{grain:1,medicine:1},transactions:['buy-grain','buy-medicine']},
 intro:['罗掌柜','这回有两样东西要买。两家铺子的收钱规矩不一样。'],outro:['阿禾','原来买卖的顺序，也是一笔账。可要是两家铺子认的交子不一样呢？'],
 hints:['两家铺子的支付条件不同。','先花掉的铁钱，会为货物腾出空间。','粮食可付 3 铁钱 + 1 交子，药材付 1 铁钱 + 3 交子。两种购买顺序都能完成。'],
 lessons:{money:['阿禾','先买哪一样，也得算算钱袋装不装得下。'],grain_shop:['粮商','粮食占三格，货款至少给三份铁钱。'],medicine_shop:['药商','药材一格重，至少收三份交子。']}
},{
 id:'l03',number:3,title:'谁信这张纸？',mission:'选择市场采购，送至商行',capacity:5,maxSteps:3,start:'warehouse',goal:'delivery',issuer:'a',
 initial:{iron:4,notes:{a:4},cargo:{}},goods:{cloth:{name:'布料',weight:2,icon:7}},
 nodes:[node('warehouse','货仓',18,45,0),node('east_market','东市',49,29,1),node('exchange','换票铺',32,79,5),node('west_market','西市',67,86,1),node('delivery','交付商行',83,54,4)],
 edges:[['warehouse','east_market'],['east_market','delivery'],['warehouse','exchange'],['exchange','west_market'],['west_market','delivery']],
 transactions:[Object.assign(buy('buy-east','east_market','cloth',6,2),{exclusive:'purchase'}),{id:'swap-notes',nodeId:'exchange',type:'swap',from:'a',to:'b',amount:4,received:3},Object.assign(buy('buy-west','west_market','cloth',4,0,3,'b'),{exclusive:'purchase'})],target:{cargo:{cloth:1},transactions:[]},
 intro:['阿禾','东市收这张票，西市却不认。先看看两家的条件。'],outro:['许掌柜','一张纸为什么值钱？得有人愿意认，也得有人能兑现。'],
 hints:['看看交子上的商号。','东市接受甲票，去西市需要先换乙票。','东市付 2 铁钱 + 4 甲票；或先换 4 甲为 3 乙，西市付 1 铁钱 + 3 乙票。'],
 lessons:{money:['阿禾','东市与西市，都能完成同一笔采购。'],exchange:['许掌柜','四份甲号交子，换三份乙号交子。'],west_market:['西市商人','这里收乙号交子，至少三份。']}
}];
return Object.assign({},all[0],{all,get:id=>all.find(l=>l.id===id)||all[0],issuerNames:{a:'甲号交子',b:'乙号交子',official:'官交子'}});
});
