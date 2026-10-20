(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ShuChapterOne=factory();})(this,function(){
'use strict';
// V4.0 supplied script. Pure narrative data; money and roads remain in engine/level.
const VERSION=4,emotions={平常:'neutral',平静:'neutral',微笑:'smile',满意:'smile',释然:'smile',认真:'firm',严肃:'firm',思索:'thinking',无奈:'thinking',担忧:'worried',为难:'worried'};
function initial(){return {version:VERSION,phase:'entry',flags:{},seenEvents:{},routeVisited:[],draftEnabled:false,paymentOpen:true,skipRead:false,bubble:{id:'arrival',text:'雨停了，门檐还在滴水。介绍信的一角已经软了。'}};}
function valid(s){return !!s&&s.version===VERSION&&['entry','counter','coin','box','prepare','road','cloth','payment','return','delivery','record','ending','settled','stay','failed'].includes(s.phase)&&s.flags&&typeof s.flags==='object'&&!Array.isArray(s.flags)&&s.seenEvents&&typeof s.seenEvents==='object'&&!Array.isArray(s.seenEvents)&&Array.isArray(s.routeVisited)&&s.routeVisited.length<40&&s.routeVisited.every(id=>['warehouse','bridge','street','alley','shop','delivery'].includes(id));}
const row=(speaker,text,emotion='平常',pose='idle')=>({speaker,text,expression:emotions[emotion]||'neutral',pose});
const a=(text,emotion='平常')=>row('阿禾',text,emotion),luo=(text,emotion='平静')=>row('罗掌柜',text,emotion),shen=(text,emotion='平常')=>row('沈娘子',text,emotion),you=text=>row('你',text),n=text=>row('旁白',text);
const choice=(id,label,next,effects={})=>({id,label,next,effects});
function event(id,s,stats={}){const f=s.flags;let lines=[],choices=[],done={};
 switch(id){
 case 'greeting':lines=[a('找罗掌柜？'),you('信上写的是这里。'),a('那没走错。进来吧，门槛有些滑。','微笑')];done={flags:{metAhe:true}};break;
 case 'introduction':lines=[luo('信给我看看。'),n('罗掌柜看信，阿禾给你放了一碗水。'),luo('会看货单么？')];choices=[choice('learn','会，没独自办过买卖。','intro-learn'),choice('ask','认字。别的，得边做边学。','intro-ask'),choice('look','你先给我看看。','intro-look')];break;
 case 'intro-learn':lines=[luo('那就先办一笔小的。')];done={next:'commission'};break;
 case 'intro-ask':lines=[a('肯问就行，别跟钱袋较劲。','微笑')];done={next:'commission'};break;
 case 'intro-look':lines=[luo('不急。先把手暖一暖。')];done={next:'commission'};break;
 case 'commission':lines=[luo('布铺给我们留了一批青布。阿禾带你认路，你来核货、付账。'),a('先看货款。我去拿单子。')];done={phase:'counter'};break;
 case 'ledger':lines=[n('同一笔账改了两次，旧数划去，新数写在旁边。'),a('错的别擦，划掉，旁边写清楚。省得过两天自己也不认。')];break;
 case 'hook':lines=[you('空的这个挂什么？'),a('我的斗笠。昨日借出去了，还没还。','微笑')];break;
 case 'water':lines=[n('水已经不烫了。'),a('再等会儿，可就只能洗手了。')];break;
 case 'loose-coin':lines=[a('等一下，袋口没系好。','认真'),n('一枚松脱的铁钱滚到了柜底。钱仍在店内，货款没有减少。')];done={phase:'coin'};break;
 case 'found-box':lines=[you('这里还有个匣子。'),a('……能拿出来么？','担忧')];done={phase:'box'};break;
 case 'old-note':lines=[a('掌柜，你来看。'),luo('原来在这里。','为难'),a('你上回说，大概同旧账纸一道收走了。'),luo('是我记岔了。')];choices=[choice('help','先扶稳，匣底快散了。','note-help',{oldNoteResponse:'help'}),choice('ask','这张交子，是谁留下的？','note-ask',{oldNoteResponse:'ask'}),choice('wait','把匣子放上柜台，等他们说。','note-wait',{oldNoteResponse:'wait'})];break;
 case 'note-help':lines=[a('你托着这边。我来合盖。'),luo('多谢。搁柜上吧。')];done={next:'note-away'};break;
 case 'note-ask':lines=[luo('以前的一笔账，还没查清。','为难'),a('那这次别再混进废纸里了。','认真'),luo('不会。')];done={next:'note-away'};break;
 case 'note-wait':lines=[a('你手上都是灰。'),n('她递来一块布。罗掌柜收起木匣，没有再翻开。')];done={next:'note-away'};break;
 case 'note-away':lines=[n('罗掌柜把木匣收进柜格，上了锁。'),a('先去取布。再晚些，沈娘子就要忙了。')];done={phase:'prepare',flags:{oldNoteSeen:true},next:'prepare'};break;
 case 'prepare':lines=[luo('这里是八份铁钱。布钱六份，路上花的也从这里出。回来对账。'),a('钱袋只能承五格。你先试试。','认真')];break;
 case 'exchange-info':lines=[a('这批货款可以在出仓前办兑换。每办一次收一份，余下换成交子。'),you('布铺肯收？'),a('肯。但至少要给她两份铁钱。她的条件记在货单上了。','认真')];break;
 case 'depart':lines=[a('我认路，怎么走你来挑。')];done={phase:'road'};break;
 case 'old-question':lines=[you('那张旧交子，还能用么？'),a('我没打算拿它去买东西。','思索'),you('那为什么还留着？'),a('有些事得看过上面的记号，才能继续查。等回来再说吧。','担忧')];break;
 case 'bridge':lines=[row('守桥人','往这边过，一份铁钱。'),a('来回都收。咱们这回过去就到布铺，不折回来。'),n('守桥人接过钱，挪开拦路木杆。'),you('你日日都走这里？'),a('我没带货时，走下头。省下的钱还能买点东西。','微笑')];break;
 case 'bridge-water':lines=[n('昨夜落下的树叶积在桥墩边。阿禾把你往里侧让了让。'),a('看归看，钱袋别探出去。','认真')];choices=[choice('hat','你掉过？','bridge-hat'),choice('steady','我拿稳了。','bridge-steady')];break;
 case 'bridge-hat':lines=[a('斗笠掉过。那回我追了半条街。','微笑')];break;
 case 'bridge-steady':lines=[a('好。新来的总要多问一句。')];break;
 case 'cloth-rack':lines=[you('这些颜色差得不多，怎么认？'),a('摊开看。折在里头的，和晒在外头的也未必一样。','思索'),you('你连布也会挑？'),a('看别人挑过。待会儿沈娘子要问，你可别替我夸口。','微笑')];done={flags:{clothInspected:true}};break;
 case 'ahe-history':lines=[you('你在罗记多久了？'),a('三年。刚来那阵，送过一次货，回来才发现单子没让人收。'),you('后来呢？'),a('又跑了一趟。人都吃上饭了，我在门口等。','无奈')];choices=[choice('remind','所以今天才让我拿单子？','history-remind'),choice('wages','掌柜扣你工钱了？','history-wages')];break;
 case 'history-remind':lines=[a('嗯。总得有人提醒下一位。','微笑')];break;
 case 'history-wages':lines=[a('没扣。让我第二天自己去补。')];break;
 case 'alley-note':lines=[f.oldNoteResponse==='help'?a('方才多谢你托着。那匣底真要散了。'):you('柜底那个匣子，你找过很久？'),a('找过。后来店里搬了几次东西，就更说不清在哪里了。','思索'),you('你认得那张纸？'),a('上头有我爹做的记号。','担忧'),n('她看向布铺的方向，等挑担的人从巷口过去。'),a('我只想先看看。你别在铺子里替我问人，好么？')];choices=[choice('wait','好，等你想说再说。','privacy-wait',{notePrivacy:'promise',fatherClueSeen:true}),choice('help','若查账要帮忙，可以找我。','privacy-help',{notePrivacy:'promise',fatherClueSeen:true}),choice('quiet','我不懂，暂时不问了。','privacy-quiet',{notePrivacy:'neutral',fatherClueSeen:true})];break;
 case 'privacy-wait':lines=[a('嗯。走吧。')];break;
 case 'privacy-help':lines=[a('你先把今日这笔记清。我可记着这句话。','微笑')];break;
 case 'privacy-quiet':lines=[a('也好。')];break;
 case 'shop':lines=[shen('阿禾？这位是新来的？'),a('掌柜让他来取布。我带个路。','微笑'),shen('那货单给我，还是给他看？','微笑'),a('先给他吧。总不能我看、我拿、我付，他在旁边站着。'),n('沈娘子把三包布挪到柜台上。'),shen('三家预订的，都放在这里。你核对自己的那包，别替别人带走了。')];done={phase:'cloth'};break;
 case 'wrong-grey':lines=[shen('那包陈记已经付过定钱。你若替他带走，他待会儿可得来找我。','微笑'),a('单子在手里，摊开再看一眼。','认真')];break;
 case 'wrong-white':lines=[shen('这一包是素布。罗记留的带青色，你看看边角。')];break;
 case 'cloth-blue':lines=[shen('是这包。别急着扎，翻一下靠窗的那个角。','认真')];choices=[choice('inspect','展开布角','damp-inspect'),choice('pack','先收好，回店再摊开','damp-pack')];break;
 case 'damp-inspect':lines=[n('布角颜色深了一点。手指掠过，有些凉。'),you('这里湿了。'),shen('窗缝漏雨，早上才发现。里面没沾，回去把这角摊开，别闷着。','认真')];choices=[choice('more','再展开些确认','damp-more',{dampCornerSeen:true}),choice('remember','明白，我记着','damp-remember',{dampCornerSeen:true})];break;
 case 'damp-more':lines=[n('内层干燥，布面平整。'),shen('这样看仔细些也好。')];done={next:'cloth-ready'};break;
 case 'damp-remember':lines=[shen('回去记得告诉收货的人。')];done={next:'cloth-ready'};break;
 case 'damp-pack':lines=[shen('也行。最外头那角受了潮，回店别直接上架。','认真')];done={flags:{dampCornerSeen:false},next:'cloth-ready'};break;
 case 'cloth-ready':lines=[f.clothInspected?a('方才还问怎么挑，这就用上了。','微笑'):a('回去放货台上，先别压到账册。')];done={phase:'payment',flags:{clothSelected:true}};break;
 case 'payment':lines=[shen('整批六份。至少两份铁钱，其余交子也收。')];break;
 case 'why-iron':lines=[you('为什么要留两份铁钱？'),shen('下午送货的来取脚钱，我得给他备着。你们先前也是这样付的。')];break;
 case 'paid':lines=[shen('数目对了。','微笑'),n('她把布包转过来，提手朝向你。阿禾伸手扶了一下，很快又松开。'),a('提得住么？')];choices=[choice('lead','行，你领路','paid-lead'),choice('carry','你刚才是不是想替我拿？','paid-carry')];break;
 case 'paid-lead':lines=[a('这回前堂，你认得门了。','微笑')];done={next:'paid-away'};break;
 case 'paid-carry':lines=[a('顺手。那你拿稳，我不抢。','微笑')];done={next:'paid-away'};break;
 case 'paid-away':lines=[shen('湿的那角，回去记得摊开。','认真')];done={phase:'return'};break;
 case 'delivery':lines=[luo('回来了。放这边。'),luo('货看过了？'),f.dampCornerSeen?you('青布没错。外角受了潮，里面干的，得先摊开。'):you('沈娘子说，外角有些潮，别直接上架。'),f.dampCornerSeen?luo('好，放窗边。我等会儿来收。','满意'):luo('那就在这儿打开看看。')];done=f.dampCornerSeen?{flags:{clothAcknowledged:true,deliveryReady:true}}:{flags:{needsInspection:true}};break;
 case 'delivery-check':lines=[n('布角摊开，内层干燥。'),luo('没事，晾一晾。下回在铺里看清楚，省得抱回来再拆。')];done={flags:{clothAcknowledged:true,deliveryReady:true,needsInspection:false}};break;
 case 'record':lines=[luo('这笔你记。')];choices=[choice('ledger','先把钱和货记清楚','report-ledger',{reportStyle:'ledger'}),choice('detail','再补一句布角受潮，已摊开','report-detail',{reportStyle:'detail'}),choice('question','这样付钱还可以怎么安排？','report-question',{reportStyle:'question'})];break;
 case 'report-ledger':lines=[you('货款'+stats.payment+'份，路费'+stats.tollFee+'，余款'+stats.balance+'。布已送到。'),luo('嗯，写得清楚。','满意')];done={next:'record-away'};break;
 case 'report-detail':lines=[luo('这个也记。换个人收货，就知道不用再拆一遍。','满意'),a('你记着了，我就不用再喊一声。','微笑')];done={next:'record-away'};break;
 case 'report-question':lines=[luo('有别的付法。先把你这一趟的账留下，想换一条路，回头再算。')];done={next:'record-away'};break;
 case 'record-away':lines=[stats.bridge?a('这回走桥。你给我看的路线，确实少一段。'):a('后巷有点绕，好在一趟就办齐了。','微笑'),luo('先歇会儿。我去前头收货。')];done={phase:'ending',next:'ending'};break;
 case 'ending':lines=[f.fatherClueSeen?a('早上那个匣子，掌柜答应让我再看看。'):a('早上那张纸，上面有我爹做的记号。我找了它很久。','思索')];if(f.notePrivacy==='promise'||f.oldNoteResponse==='help')done={next:'invite'};else choices=[choice('paper','你还想查那张交子？','ending-paper'),choice('record','今日的账，我记好了','ending-record')];break;
 case 'ending-paper':lines=[a('嗯。我想先认清上面的字。')];done={next:'ending-choice'};break;
 case 'ending-record':lines=[a('我看见了。我也有一笔旧账，想重新看看。')];done={next:'ending-choice'};break;
 case 'invite':lines=[a('一会儿我想再看看那张纸。你愿意陪我么？','思索')];done={next:'ending-choice'};break;
 case 'ending-choice':lines=[you('要我做什么？'),a('陪我看一眼。看不明白的，先抄下来。别急着替谁说话。','认真')];choices=[choice('careful','好，先看清楚。','ending-careful',{endingAttitude:'careful'}),choice('honest','字我可以帮你抄，账还得慢慢学。','ending-honest',{endingAttitude:'honest'}),choice('later','今天先歇一歇，明日再看。','ending-later',{endingAttitude:'later'})];break;
 case 'ending-careful':lines=[a('那等掌柜忙完。','微笑')];done={next:'closing'};break;
 case 'ending-honest':lines=[a('够了。我也没弄明白呢。','微笑')];done={next:'closing'};break;
 case 'ending-later':lines=[a('也行。东西找着了，总算不用再翻柜底。')];done={next:'closing'};break;
 case 'closing':lines=[n('门口又响起车轮声。你把账簿上的墨迹晾干，将笔搁回原处。柜格还锁着，钥匙在罗掌柜腰间。')];done={phase:'settled',flags:{endingSeen:true}};break;
 case 'stay-ahe':lines=[a('等掌柜忙完，我再叫你。')];break;
 case 'stay-luo':lines=[luo('今日这笔，账在你写的那页。')];break;
 default:return null;
 }
 return {id,lines:lines.map((line,i)=>Object.assign({id:'v4:'+id+':'+i},line)),choices,done,onceScope:'run'};
}
function stats(s){const buys=s.events.filter(e=>e.type==='buy'),exchangeFee=s.events.filter(e=>e.type==='exchange').reduce((v,e)=>v+e.fee,0),tollFee=s.events.filter(e=>e.type==='move').reduce((v,e)=>v+(e.fee||0),0);return {payment:buys.reduce((v,e)=>v+e.iron+Object.values(e.notes||{}).reduce((a,b)=>a+b,0),0),exchangeFee,tollFee,balance:s.iron+Object.values(s.notesByIssuer).reduce((a,b)=>a+b,0),bridge:s.routeHistory.includes('bridge'),steps:s.stepsUsed};}
function objects(st,s){const f=st.flags,p=st.phase,node=s.nodeId;const obj=(id,label,kind='talk',disabled=false)=>({id,label,kind,disabled});
 if(p==='entry')return [obj('greeting','阿禾'),obj('enter','走进后仓','place',!f.metAhe)];
 if(p==='counter')return [obj('money','钱袋','object'),obj('ledger','账簿','object'),obj('hook','挂钩','object'),obj('water','水碗','object')];
 if(p==='coin')return [obj('coin','拾起柜底铁钱','object')];
 if(p==='box')return [obj('box','托住匣底','object'),obj('note','看看押记','object')];
 if(p==='prepare')return [obj('prepare','柜台配货款','object'),obj('note','旧交子','object'),obj('old-question','问阿禾')];
 if(p==='cloth')return [obj('blue','青布 · 罗记','cloth'),obj('grey','灰布 · 陈记','cloth'),obj('white','素布 · 吴记','cloth'),obj('order','货单','object')];
 if(p==='payment')return [obj('pay','付布钱','object'),obj('order','货单','object'),obj('why-iron','问铁钱的规矩')];
 if(node==='warehouse'&&s.departed)return [obj('repack','重配货款','object',s.stepsUsed>0),obj('old-question','问旧交子')];
 if(node==='bridge')return [obj('bridge-water','桥边看看','object')];
 if(node==='street')return [obj('cloth-rack','挂布架','object'),obj('ahe-history','问阿禾')];
 if(node==='alley')return [obj('alley-note','问旧匣的事')];
 if(node==='delivery'&&s.status==='playing')return [obj('delivery','货台核货','object'),...(f.needsInspection?[obj('inspect-delivery','展开检查','object')]:[]),obj('order','货单','object')];
 if(p==='stay')return [obj('stay-ahe','阿禾'),obj('stay-luo','罗掌柜'),obj('account','账簿','object')];
 return [];
}
function goal(st,s){if(st.phase==='entry')return '拜访罗掌柜';if(['counter','coin','box'].includes(st.phase))return '到柜台准备货款';if(st.phase==='prepare')return '配好货款，再出发';if(st.phase==='cloth')return '对照货单，找出罗记的布';if(st.phase==='payment')return '付清六份布钱';if(s.cargoById.cloth)return '把布送到罗记前堂';if(s.status==='won')return st.flags.endingSeen?'这一笔，记好了':'留在货台边，把话说完';return '前往布铺取货';}
return {VERSION,initial,valid,event,stats,objects,goal,emotions};
});
