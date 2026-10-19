from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[1]
raw=(root/'docs/story/manuscript-source.txt').read_text(encoding='utf-8-sig')
scenes=[]
for block in re.split(r'(?m)^@',raw):
 if not block.strip():continue
 rows=block.strip().splitlines();sid,chapter,title,time=rows[0].split('|');lines=[]
 for i,row in enumerate(rows[1:]):
  if not row.strip():continue
  m=re.match(r'([^\[:]+)(?:\[([^\]]+)\])?:(.*)',row)
  if not m:raise ValueError(row)
  speaker,expression,text=m.groups()
  lines.append({'id':sid+'-'+str(i),'speaker':speaker,'expression':expression or 'neutral','text':text})
 scenes.append({'id':sid,'chapter':chapter,'title':title,'time':time,'kind':'scene','lines':lines,'next':None})
for i,s in enumerate(scenes[:-1]):
 if not s['id'].startswith('e'):s['next']=scenes[i+1]['id']
byid={s['id']:s for s in scenes}
choices={
'p1':{'flag':'load','prompt':'你怎么接她伸来的手？','options':[
 ('share','分一半给她。','c11',[
 ('你','neutral','那你也别把自己的全留着。'),('阿禾','smile','知道了，合伙人。'),('旁白','neutral','她没去挑轻的那件，接过半包东西，重新系紧。你们一前一后让过小车，才又并肩走起来。')]),
 ('carry','自己背，但请她带路。','c11',[
 ('你','neutral','这段我先自己背。路你熟，慢一点等我。'),('阿禾','neutral','成。撑不住就说，别拿肩膀跟包袱赌气。'),('旁白','neutral','她收回手，将步子放慢。过桥时，每走几步便回头看一眼，等你跟上再往前。')])]},
'c23':{'flag':'ticket','prompt':'她把自己的到期票推到你面前。','options':[
 ('open','经她同意，仔细看日期和数额。','c31',[
 ('你','neutral','我看完还你。不抄，也不替你拿去换。'),('阿禾','relieved','看吧。边上那道歪字是我记的，别笑。'),('旁白','neutral','你看见她将一笔笔积攒的日期记在背面，最早的一笔比你想的早得多。你只指给她看约定的兑付日，没有把票拿离灯下。')]),
 ('private','不看她的私账，答应明天陪她去。','c31',[
 ('你','neutral','不用给我看。明天你问，我在旁边听。'),('阿禾','relieved','好。真有哪里我听不明白的，再请你帮我看。'),('旁白','neutral','她把票折好，放回贴身的袋里，却将钱袋的系带留在桌上，慢慢给你补那道将要断开的针脚。')])]},
'c32':{'flag':'approach','prompt':'你要许掌柜先回答哪件事？','options':[
 ('ask','先给出能兑的数额和确切日期。','c33',[
 ('你','neutral','从前的招牌先放下。你现在能兑多少，余下要等到哪天？'),('许掌柜','worried','钱匣可以开。日期……我得把后头的账也拿出来。'),('阿禾','firm','拿出来。看过再说，别又先许一个日子。')]),
 ('confront','先解释，为什么明知不够却一直隐瞒。','c33',[
 ('你','neutral','你不是今日才知道不够。为什么来一个，就让一个再等？'),('许掌柜','defensive','若那天贴出来，铺子怕是当天就要关。'),('你','neutral','那是你的难处。让别人带着不知道的难处过日子，也是你的决定。'),('许掌柜','ashamed','是。我先把隐着的几笔拿来。')])]},
'c43':{'flag':'proof','prompt':'明日前，你想先核实什么？','options':[
 ('ledger','留下核清账目，分开可兑的钱与未到的货。','c51',[
 ('你','neutral','我在这里把每笔到期日核一遍。收不回来的钱，先别写成能给。'),('阿禾','firm','我去找愿意当面核对的人。不是替你们说情，是让他们自己看。'),('旁白','neutral','夜里你将一笔重复列入的茶款圈掉。总数少了一截，许掌柜捏着笔没有反驳。罗掌柜重新写了第一期数额，数字更难看，却终于对得上钱匣。')]),
 ('visit','带上现有账页，先走访等着兑付的人。','c51',[
 ('你','neutral','我想先听听，谁等不起。这不是催得最响的人先拿。'),('阿禾','neutral','我和你去。别只记谁跟掌柜熟。'),('旁白','neutral','你们问过后街的药客、要回乡的行脚人，也被一家人拒之门外。回来时，阿禾将几项急需的用途写下，隐去姓名。罗掌柜按当面确认过的数额重算了首期，不再拿沉默当同意。')])]},
'c52':{'flag':'settlement','prompt':'只决定你自己的这笔旧票。','options':[
 ('scheduled','看过账，接受写清日期的分次兑付。','c53',[
 ('你','neutral','我的可以分次。每一次都写实付，哪笔迟了，要重新谈。'),('许掌柜','firm','记在你名下。只代表你，不拿去劝别人。'),('旁白','neutral','你在自己那一栏落笔。旁边仍有拒绝等待的人，许掌柜另取一张纸，接着跟他们谈折抵。没有一纸“众人同意”。')]),
 ('cash','要求尽快清偿，接受当面核价的资产折抵。','c53',[
 ('你','neutral','我不能把周转的钱一直留在这里。可以谈折抵，但东西要验清，差额还记着。'),('许掌柜','ashamed','后屋有我自己的几件货，还有一处可处置的家产。我拿清单来，不占今天给别人的这匣钱。'),('罗掌柜','firm','估价另请人看。我在此事里有担保，不能只让我一句作数。'),('旁白','neutral','你约好另请人核价，再按交割记录核补差款。阿禾看过你的记录，只问验货那天还要不要帮你搬货，没有劝你把体谅当成货款。')])]},
'c63':{'flag':'future','prompt':'这一次，你希望与她怎样走下去？','options':[
 ('stay','一起留一年，把铺子好好做起来。','e1',[
 ('你','neutral','留下来一年吧。不是替我看铺，是把你想做的那份也做起来。'),('阿禾','worried','明年要是我还想走？'),('你','neutral','明年再商量。你不欠我这一年以后的日子。'),('阿禾','relieved','那好。先从换两只不漏水的茶碗开始。')]),
 ('travel','带上货单，与她合伙跑一趟远路。','e2',[
 ('你','neutral','你留一个人的位置给我。不是给你带行李，我也带一份生意。'),('阿禾','embarrassed','本钱各记各的？'),('你','neutral','各记各的，路一起走。'),('阿禾','relieved','说定了。明早别让我一个人在桥头等。')]),
 ('separate','我守着铺子，你去走想走的路。','e3',[
 ('你','neutral','我想留下。你去吧，想回来时，这里还有一间铺子。'),('阿禾','worried','你真不是怕我为难才这么说？'),('你','neutral','我想了。你也想了。我们可以想得不一样。'),('阿禾','relieved','好。那就认真送我一回，别装作只是顺路。')])]}
}
branches=[]
for sid,c in choices.items():
 s=byid[sid];opts=[]
 for value,label,target,lines in c['options']:
  bid=sid+'-'+value;branches.append({'id':bid,'chapter':s['chapter'],'title':'选项回应：'+label,'time':s['time'],'kind':'branch','lines':[{'id':bid+'-'+str(i),'speaker':who,'expression':expression,'text':text} for i,(who,expression,text) in enumerate(lines)],'next':target})
  opts.append({'id':value,'text':label,'set':{c['flag']:value},'target':bid})
 s['choice']={'id':sid+'-choice','prompt':c['prompt'],'options':opts};s['next']=None
# Delayed callbacks keep each choice legible later; private correspondence never becomes public evidence.
def callback(sid,index,flag,value,speaker,expression,text):
 byid[sid]['lines'].insert(index,{'id':sid+'-'+flag+'-'+value,'speaker':speaker,'expression':expression,'text':text,'condition':{flag:value}})
callback('c12',2,'load','share','阿禾','smile','刚才分给我的包袱里怎么还有空袋子？等回去，布你也得分我一角扶着。')
callback('c12',2,'load','carry','阿禾','worried','你早上自己背那一段，肩上都红了。这匹布总该让我扶一角吧。')
callback('c31',6,'ticket','open','阿禾','neutral','你昨夜看过日期了。到柜前，若他们改口，你替我再问一句。')
callback('c31',6,'ticket','private','阿禾','neutral','我自己报日期和数额。若我急起来说乱了，你就提醒我先停一下。')
callback('c41',3,'approach','ask','罗掌柜','ashamed','许记说，你们先问能兑多少。我今天也不拿从前的交情挡这句话。')
callback('c41',3,'approach','confront','罗掌柜','ashamed','你昨天问他为什么瞒着。这句话，也该问我。')
callback('c51',4,'proof','ledger','旁白','neutral','昨夜圈去的那笔重复来款仍留在账页上，谁来核对都能看见。首期数额旁，多了你与两位掌柜分别核过的记号。')
callback('c51',4,'proof','visit','旁白','neutral','昨日走访过的老客先认出你，却没要求插队。你将匿名记下的急需用途交给众人核对，是否先照顾急用者，仍要他们当面商量。')
callback('c61',3,'settlement','scheduled','旁白','neutral','你的旧单上，每一期实付都在。后来你并不是每次都亲自去，有时让阿禾带回，有时许掌柜自己送来，到了最后一笔，你才签下结清。')
callback('c61',3,'settlement','cash','旁白','neutral','你的款项早已通过另行核价的货物折抵与补差清偿。其余人的分期记录，你只在受托核账时翻过，不把他们愿等的时间算成自己的恩德。')
# Ending 3 belongs to choosing separate paths, independent of financial position.
byid['e3']['lines']=byid['e3']['lines'][2:]
callback('e3',0,'settlement','cash','旁白','neutral','当年你选择尽快清偿自己的旧票。后来你与许记仍做小额现货生意，每次当面验清，既没回到从前，也没有因此互不来往。')
callback('e3',0,'settlement','scheduled','旁白','neutral','当年你等过分期，如今那张旧单已经结清。阿禾把蓝线票收在自己的匣子里，不再随身带着，也没有扔。')
for sid,level,title in [('c12','l01','布匹之约'),('c22','l02','两笔买卖'),('c31','l03','谁信这张纸'),('c41','l04','转手生意'),('c51','l05','兑付风波'),('c62','l06','新交子')]:
 byid[sid]['interlude']={'levelId':level,'title':title,'optional':True,'onSkip':'按普通完成衔接下一幕，不删除剧情选项。','onFailure':'可重试、撤销或略过；人物承认遇到困难，不抹去既有关系选择。'}
scenes.extend(branches)
data={'title':'蜀地钱路 · 灯下旧账','version':1,'start':'p0','draft':True,'scenes':scenes,'expressions':json.loads((root/'docs/story/story-bible.json').read_text(encoding='utf-8'))['expressions']}
(root/'web/concept/story.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
# Build a human-readable complete manuscript, including every option and delayed callback.
parts=[data['title']+'｜完整分支台本初稿','2026-10-19　第二人称文游；主线、所有分支与三个结尾均列出。','阅读规则：括号是表情/演出，不是角色说出的文字；“条件”行只在对应选项下出现。','制作边界：本稿重写故事与呈现，不自动变更当前六关规则。跳过短委托仍可读完整故事。','史实边界：人物、铺号与兑付安排为虚构。第六章明确为多年后，不把官方发行压缩成七日事件。','']
for s in scenes:
 if s['kind']=='branch':continue
 parts += ['='*48,s['chapter']+'｜'+s['title'],s['time']+'　节点 '+s['id'],'']
 for l in s['lines']:
  prefix='【条件 '+', '.join(k+'='+v for k,v in l.get('condition',{}).items())+'】' if l.get('condition') else ''
  expr='〔'+l['expression']+'〕' if l['speaker'] not in ['你','旁白'] else ''
  parts.append(prefix+l['speaker']+expr+'：'+l['text'])
 if s.get('interlude'):parts += ['', '【可选短委托】'+s['interlude']['title']+'；可亲自跑一趟，也可略过操作继续故事。此处只定义接入位置，未改动正式关卡。']
 if s.get('choice'):
  parts+=['','【玩家选择】'+s['choice']['prompt']]
  for o in s['choice']['options']:
   parts+=['','◇ '+o['text']+'　〔记录 '+str(o['set'])+'〕']
   branch=next(b for b in branches if b['id']==o['target'])
   for l in branch['lines']:parts.append('  '+l['speaker']+'〔'+l['expression']+'〕：'+l['text'])
   parts.append('  → 转入 '+branch['next'])
 parts.append('')
text='\n'.join(parts)
for en,zh in {'neutral':'平静','smile':'微笑','worried':'担忧','embarrassed':'窘迫','firm':'认真','hurt':'受伤','relieved':'释然','hesitant':'迟疑','ashamed':'惭愧','defensive':'戒备','polite':'客气'}.items():
 text=text.replace('〔'+en+'〕','〔'+zh+'〕')
text+='\n演出约定：说话者保持直视玩家；听者稍暗，不变透明。相同情绪保持原帧。遇受伤、惭愧、迟疑等转折，先停顿约200毫秒，再切换表情；不逐句摆动。人物具体动作已写在旁白。玩家与旁白发言时不误换为另一人的口型。\n'
(root/'docs/story/灯下旧账-完整台本.txt').write_text(text,encoding='utf-8')
count=sum(len(re.findall(r'[\u4e00-\u9fff]',l['text'])) for s in scenes for l in s['lines'])
report={'sceneCount':len([s for s in scenes if s['kind']=='scene']),'branchCount':len(branches),'choiceCount':len(choices),'lineCount':sum(len(s['lines']) for s in scenes),'chineseCharacters':count,'endings':['e1','e2','e3']}
(root/'docs/story/draft-stats.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
