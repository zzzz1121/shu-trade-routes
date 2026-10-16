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
}];
return Object.assign({},all[0],{all,get:id=>all.find(l=>l.id===id)||all[0],issuerNames:{a:'甲号交子',b:'乙号交子',official:'官交子'}});
});
