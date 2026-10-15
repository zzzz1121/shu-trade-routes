(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ShuLevel=factory();})(this,function(){
return {id:'one-cart',title:'一车铁钱',initialIron:8,capacity:5,maxSteps:4,exchangeFee:1,
start:'warehouse',goal:'delivery',shop:'shop',goods:{id:'cloth',name:'布料',price:6,weight:2,minIron:2},
nodes:[{id:'warehouse',name:'货仓',symbol:'仓',x:20,y:16},{id:'bridge',name:'收费桥',symbol:'桥',x:72,y:16,toll:1},{id:'street',name:'街巷',symbol:'街',x:20,y:40},{id:'alley',name:'后巷',symbol:'巷',x:20,y:64},{id:'shop',name:'布铺',symbol:'铺',x:72,y:64},{id:'delivery',name:'交付点',symbol:'交',x:72,y:88}],
edges:[['warehouse','bridge'],['bridge','shop'],['warehouse','street'],['street','alley'],['alley','shop'],['shop','delivery']]};
});
