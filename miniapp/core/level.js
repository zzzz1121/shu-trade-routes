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
 reviews:[{node:'east_market',text:'东市直购，少走一段路。'},{node:'west_market',text:'换了商号，货款也省下一份。'}],
 id:'l03',number:3,title:'谁信这张纸？',mission:'选择市场采购，送至商行',capacity:5,maxSteps:3,start:'warehouse',goal:'delivery',issuer:'a',
 initial:{iron:4,notes:{a:4},cargo:{}},goods:{cloth:{name:'布料',weight:2,icon:7}},
 nodes:[node('warehouse','货仓',18,45,0),node('east_market','东市',49,29,1),node('exchange','换票铺',32,79,5),node('west_market','西市',67,86,1),node('delivery','交付商行',83,54,4)],
 edges:[['warehouse','east_market'],['east_market','delivery'],['warehouse','exchange'],['exchange','west_market'],['west_market','delivery']],
 transactions:[Object.assign(buy('buy-east','east_market','cloth',6,2),{exclusive:'purchase'}),{id:'swap-notes',nodeId:'exchange',type:'swap',from:'a',to:'b',amount:4,received:3},Object.assign(buy('buy-west','west_market','cloth',4,0,3,'b'),{exclusive:'purchase'})],target:{cargo:{cloth:1},transactions:[]},
 intro:['阿禾','东市收这张票，西市却不认。先看看两家的条件。'],outro:['许掌柜','一张纸为什么值钱？得有人愿意认，也得有人能兑现。'],
 hints:['看看交子上的商号。','东市接受甲票，去西市需要先换乙票。','东市付 2 铁钱 + 4 甲票；或先换 4 甲为 3 乙，西市付 1 铁钱 + 3 乙票。'],
 lessons:{money:['阿禾','东市与西市，都能完成同一笔采购。'],exchange:['许掌柜','四份甲号交子，换三份乙号交子。'],west_market:['西市商人','这里收乙号交子，至少三份。']}
},{
 id:'l04',number:4,title:'转手生意',mission:'先卖茶，再买布并交付',capacity:5,maxSteps:5,start:'warehouse',goal:'delivery',issuer:'a',
 initial:{iron:2,notes:{a:2},cargo:{tea:1}},goods:{tea:{name:'茶包',weight:2,icon:2},cloth:{name:'布料',weight:2,icon:7}},
 nodes:[node('warehouse','货仓',18,28,0),node('tea_shop','茶行',49,29,1),node('toll_crossing','收费渡口',80,43,2,1),node('street','街巷',20,58,3),node('back_alley','后巷',36,86,3),node('cloth_shop','布坊',74,66,1),node('delivery','交付商行',77,92,4)],
 edges:[['warehouse','tea_shop'],['tea_shop','toll_crossing'],['toll_crossing','cloth_shop'],['tea_shop','street'],['street','back_alley'],['back_alley','cloth_shop'],['cloth_shop','delivery']],
 transactions:[{id:'sell-tea',nodeId:'tea_shop',type:'sell',cargo:'tea',quantity:1,price:3,issuer:'a'},buy('buy-cloth','cloth_shop','cloth',6,2)],target:{cargo:{cloth:1},transactions:['sell-tea','buy-cloth']},
 intro:['罗掌柜','这回先卖茶，再买布。路怎么走、钱收成什么样，你自己定。'],outro:['罗掌柜','这回的周转，做得像样。'],
 hints:['收钱也会改变钱袋重量。','走收费路时，要保留布坊要求的现钱。','收 3 铁钱后走渡口，付 4 铁钱 + 2 交子买布；或收 3 交子走免费路，付 2 铁钱 + 4 交子。'],
 lessons:{money:['阿禾','先想想收什么钱，钱袋也会变重。'],tea_shop:['阿禾','收铁钱方便付费，收交子轻便。先比较后面的商路。']}
},{
 reviews:[{node:'east_market',text:'东市接受甲票，可以直接混合支付。'},{node:'west_market',text:'兑足现钱，买回纸墨。'}],
 id:'l05',number:5,title:'兑付风波',mission:'买回一份纸墨，送至商行',capacity:5,maxSteps:3,start:'warehouse',goal:'delivery',issuer:'a',
 initial:{iron:2,notes:{a:5},cargo:{}},goods:{paper:{name:'纸墨',weight:2,icon:3}},
 nodes:[node('warehouse','货仓',18,43,0),node('east_market','东市',48,28,1),node('xu_exchange','许记',30,77,5),node('west_market','西市',68,86,1),node('delivery','交付商行',82,53,4)],
 edges:[['warehouse','east_market'],['east_market','delivery'],['warehouse','xu_exchange'],['xu_exchange','west_market'],['west_market','delivery']],
 transactions:[Object.assign(buy('buy-east','east_market','paper',6,1),{exclusive:'purchase'}),{id:'redeem-notes',nodeId:'xu_exchange',type:'redeem',issuer:'a',limit:3,times:1},Object.assign(buy('buy-west','west_market','paper',5,5,0,null),{exclusive:'purchase'})],target:{cargo:{paper:1},transactions:[]},
 intro:['许掌柜','今日能兑出的铁钱有限，得按规矩来。东、西两市都能买纸墨，自己选路。'],outro:['许掌柜','纸券方便，可人人都急着换钱时，就没那么简单了。'],
 hints:['东市与西市收的货款不同。','西市只收铁钱，许记最多兑付三份。','东市可付 1 铁钱 + 5 甲票；或先兑足 3 铁钱，再去西市付 5 铁钱。'],
 lessons:{money:['阿禾','许记门口，怎么有这么多人等着换钱？'],xu_exchange:['许掌柜','今天最多只能兑三份，也只能办理一次。'],west_market:['阿禾','这家只收现钱。']}
}];
return Object.assign({},all[0],{all,get:id=>all.find(l=>l.id===id)||all[0],issuerNames:{a:'甲号交子',b:'乙号交子',official:'官交子'}});
});
