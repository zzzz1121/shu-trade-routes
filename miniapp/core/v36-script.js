(function (r, f) {
  if (typeof module === 'object' && module.exports) module.exports = f();else r.ShuV36Script = f();
})(this, function () {
  return {
    "P00_01_GATE": {
      "lines": [{
        "id": "v36:line:1",
        "speaker": "旁白",
        "text": "益州的早市开得早。天光才透进街巷，铺门前的木板便一块接一块卸了下来。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:2",
        "speaker": "旁白",
        "text": "你到这座城不过三日。起先觉得路都差不多，走错两回之后，才知道连相邻的两条街，卖的东西也全然不同。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:3",
        "speaker": "旁白",
        "text": "同行的商旅昨天出了城。临走前，领队替你指过一间商行，说掌柜愿意用新手跑些不远的差事，工钱结得也爽快。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:4",
        "speaker": "旁白",
        "text": "那家商行姓罗。你记住了这一点，也记住了他写在木牌上的大字。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:5",
        "speaker": "脚夫",
        "text": "借过！小心你的脚。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:6",
        "speaker": "旁白",
        "text": "两筐货从身旁晃过去。脚夫腰间挂着一只鼓鼓的钱袋，走一步，便在木筐上磕出一声钝响。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:7",
        "speaker": "脚夫",
        "text": "今儿先搬货，晌午还得去收钱。搬回来又搬出去，背都要叫它压弯了。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:8",
        "speaker": "旁白",
        "text": "他匆匆走远。你循着街角的路牌，终于看见罗记商行的招牌。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "gate"
      },
      "sceneId": "P00_01_GATE",
      "terminal": true
    },
    "P00_02_AHE__a": {
      "sceneId": "P00_02_AHE",
      "lines": [{
        "id": "v36:line:18",
        "speaker": "阿禾",
        "text": "原来是你。昨天他还让我记着，今日说不定有个新行商来。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P00_02_AHE__1"
      }
    },
    "P00_02_AHE__b": {
      "sceneId": "P00_02_AHE",
      "lines": [{
        "id": "v36:line:19",
        "speaker": "阿禾",
        "text": "这倒看出来了。咱们的门不难找，只是这条街的路可不好认。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P00_02_AHE__1"
      }
    },
    "P00_02_AHE": {
      "lines": [{
        "id": "v36:line:14",
        "speaker": "阿禾",
        "text": "哎，留神。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:15",
        "speaker": "阿禾",
        "text": "这捆绳我刚理好，差点叫你一脚踢散了。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:16",
        "speaker": "旁白",
        "text": "她说完才抬头看你。眼神并不凶，只是有些意外。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:17",
        "speaker": "阿禾",
        "text": "你不是来提货的吧？瞧着面生。",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "我是来找罗掌柜的，有人介绍我来接差事。",
        "effects": {},
        "next": "P00_02_AHE__a"
      }, {
        "id": "b",
        "label": "刚到这儿，还没弄清门往哪边开。",
        "effects": {},
        "next": "P00_02_AHE__b"
      }],
      "done": {
        "next": "P00_02_AHE__1"
      },
      "choiceId": "CHOICE_P00_AHE_01",
      "sceneId": "P00_02_AHE"
    },
    "P00_02_AHE__1__a": {
      "sceneId": "P00_02_AHE",
      "lines": [{
        "id": "v36:line:25",
        "speaker": "阿禾",
        "text": "会看图就够了。认路的事，走过两趟便有数。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P00_02_AHE__2"
      }
    },
    "P00_02_AHE__1__b": {
      "sceneId": "P00_02_AHE",
      "lines": [{
        "id": "v36:line:26",
        "speaker": "阿禾",
        "text": "那你先怕对了一件事。走错路还能折回来，钱算错了可得当场找补。",
        "expression": "firm",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P00_02_AHE__2"
      }
    },
    "P00_02_AHE__1": {
      "lines": [{
        "id": "v36:line:20",
        "speaker": "阿禾",
        "text": "我叫阿禾，在罗记帮忙。你怎么称呼？",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:21",
        "speaker": "旁白",
        "text": "你简单作了介绍。阿禾把那捆绳系紧，拿脚尖把门边的一只空筐推开。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:22",
        "speaker": "阿禾",
        "text": "既然是来接差事的，总不能叫你第一眼只看见地上的绳。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:23",
        "speaker": "阿禾",
        "text": "掌柜在前堂。他这个人不难相处，就是看账时不爱别人插嘴。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:24",
        "speaker": "阿禾",
        "text": "你会看商路图吗？",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "会一点，但这座城还不熟。",
        "effects": {},
        "next": "P00_02_AHE__1__a"
      }, {
        "id": "b",
        "label": "比起认路，我更怕算错钱。",
        "effects": {},
        "next": "P00_02_AHE__1__b"
      }],
      "done": {
        "next": "P00_02_AHE__2"
      },
      "choiceId": "CHOICE_P00_AHE_02",
      "sceneId": "P00_02_AHE"
    },
    "P00_02_AHE__2": {
      "lines": [{
        "id": "v36:line:27",
        "speaker": "阿禾",
        "text": "对了，你别把今日的差事想得太大。罗掌柜平日可舍不得让新人一个人跑远路。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:28",
        "speaker": "旁白",
        "text": "她嘴上说得随意，却仍放慢了脚步，等你跟上。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "entry",
        "flags": {
          "metAhe": true
        },
        "next": "P00_03_LUO"
      },
      "sceneId": "P00_02_AHE",
      "terminal": true
    },
    "P00_03_LUO__a": {
      "sceneId": "P00_03_LUO",
      "lines": [{
        "id": "v36:line:33",
        "speaker": "罗掌柜",
        "text": "那正好，从小单子做起。先熟悉规矩，比赶着做大买卖稳当。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P00_03_LUO__1"
      }
    },
    "P00_03_LUO__b": {
      "sceneId": "P00_03_LUO",
      "lines": [{
        "id": "v36:line:34",
        "speaker": "罗掌柜",
        "text": "肯记错处是好事。不过替别人跑货，不能只想着自己学了多少。",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P00_03_LUO__1"
      }
    },
    "P00_03_LUO": {
      "lines": [{
        "id": "v36:line:29",
        "speaker": "罗掌柜",
        "text": "阿禾，门口怎么吵吵嚷嚷？",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:30",
        "speaker": "阿禾",
        "text": "没吵。给您领个新伙计回来。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:31",
        "speaker": "罗掌柜",
        "text": "嗯。前几日有人送来你的介绍字条，我看过。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:32",
        "speaker": "罗掌柜",
        "text": "先前跟着商旅跑过路？",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "跟着做过些杂事，还没独自交过一笔货。",
        "effects": {},
        "next": "P00_03_LUO__a"
      }, {
        "id": "b",
        "label": "想自己试试，错处也好自己记着。",
        "effects": {},
        "next": "P00_03_LUO__b"
      }],
      "done": {
        "next": "P00_03_LUO__1"
      },
      "choiceId": "CHOICE_P00_LUO_WORK",
      "sceneId": "P00_03_LUO"
    },
    "P00_03_LUO__1__a": {
      "sceneId": "P00_03_LUO",
      "lines": [{
        "id": "v36:line:39",
        "speaker": "罗掌柜",
        "text": "沈家近来接的活多。铺里留给我们的这份货，占着架子，也占着她今日该结的账。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:40",
        "speaker": "阿禾",
        "text": "我昨天路过，还见几个织娘抱着新布等着点数。她们可不只是等人来夸针脚好。",
        "expression": "firm",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P00_03_LUO__2"
      }
    },
    "P00_03_LUO__1__b": {
      "sceneId": "P00_03_LUO",
      "lines": [{
        "id": "v36:line:41",
        "speaker": "罗掌柜",
        "text": "仓里备了八份铁钱。你要买的布价六，钱数是够的。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:42",
        "speaker": "阿禾",
        "text": "钱数够，和带得去，是两码事。",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P00_03_LUO__2"
      }
    },
    "P00_03_LUO__1": {
      "lines": [{
        "id": "v36:line:35",
        "speaker": "罗掌柜",
        "text": "今日有一件不远的委托。城南沈家布铺给我留了份料子，价六，午后前取回来。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:36",
        "speaker": "阿禾",
        "text": "沈娘子今早还叫人带话，说别耽误了她的交收。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:37",
        "speaker": "罗掌柜",
        "text": "她那边还有人等着发工钱。货若拖着不取，账也不好结。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:38",
        "speaker": "旁白",
        "text": "桌上有一小截布样。颜色很素，折角却压得整整齐齐。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "为什么偏要今日午后之前？",
        "effects": {
          "asked_why_urgent": true
        },
        "next": "P00_03_LUO__1__a"
      }, {
        "id": "b",
        "label": "这份布该怎样付款？",
        "effects": {},
        "next": "P00_03_LUO__1__b"
      }],
      "done": {
        "next": "P00_03_LUO__2"
      },
      "choiceId": "CHOICE_P00_LUO_QUESTION",
      "sceneId": "P00_03_LUO"
    },
    "P00_03_LUO__2": {
      "lines": [{
        "id": "v36:line:43",
        "speaker": "罗掌柜",
        "text": "货款在后仓。阿禾领你去，先看看要怎么带。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:44",
        "speaker": "阿禾",
        "text": "掌柜倒会安排。我本来还有半筐布要点呢。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:45",
        "speaker": "罗掌柜",
        "text": "回来再点。你最清楚两条路怎么走，也熟沈家的人。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:46",
        "speaker": "旁白",
        "text": "账页掀起时，底下露出一小片旧纸，边角有一点模糊的朱红。罗掌柜顺手把它压回去了。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:47",
        "speaker": "阿禾",
        "text": "走吧。后仓这会儿没人，我们能慢慢收拾。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "frontdesk",
        "flags": {
          "noticed_red_mark_at_luo": "glimpsed"
        }
      },
      "sceneId": "P00_03_LUO",
      "terminal": true
    },
    "P01_01_WAREHOUSE__a": {
      "sceneId": "P01_01_WAREHOUSE",
      "lines": [{
        "id": "v36:line:60",
        "speaker": "阿禾",
        "text": "你倒不用非走到桥边再发现。先看看袋子吧。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_01_WAREHOUSE__1"
      }
    },
    "P01_01_WAREHOUSE__b": {
      "sceneId": "P01_01_WAREHOUSE",
      "lines": [{
        "id": "v36:line:61",
        "speaker": "阿禾",
        "text": "正是。出门只顾得上装钱，回程拿什么装货？",
        "expression": "firm",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_01_WAREHOUSE__1"
      }
    },
    "P01_01_WAREHOUSE": {
      "lines": [{
        "id": "v36:line:55",
        "speaker": "阿禾",
        "text": "来，先点货款。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:56",
        "speaker": "旁白",
        "text": "木盘里是八份铁钱。每份都用细绳理好，盘底隐约有磨擦留下的浅痕。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:57",
        "speaker": "阿禾",
        "text": "掌柜没少给你一份。倒是担心你嫌沉。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:58",
        "speaker": "旁白",
        "text": "你伸手托起木盘。重量顺着手腕往下坠，竟比看着沉不少。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:59",
        "speaker": "阿禾",
        "text": "怎么样？",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "这要全装进去，恐怕走不到布铺。",
        "effects": {},
        "next": "P01_01_WAREHOUSE__a"
      }, {
        "id": "b",
        "label": "东西是要买回来，可现在光钱就这么沉。",
        "effects": {},
        "next": "P01_01_WAREHOUSE__b"
      }],
      "done": {
        "next": "P01_01_WAREHOUSE__1"
      },
      "choiceId": "CHOICE_P01_WEIGHT",
      "sceneId": "P01_01_WAREHOUSE"
    },
    "P01_01_WAREHOUSE__1": {
      "lines": [{
        "id": "v36:line:62",
        "speaker": "阿禾",
        "text": "仓里还有些空布袋。货买回来记得放好，别叫水浸了。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "counter"
      },
      "sceneId": "P01_01_WAREHOUSE",
      "terminal": true
    },
    "P01_02_EXCHANGE_DONE": {
      "lines": [{
        "id": "v36:line:68",
        "speaker": "旁白",
        "text": "木盒里传来铁钱相碰的轻响。桌上多了一张轻薄的票据，钱袋里却腾出了地方。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:69",
        "speaker": "阿禾",
        "text": "这下提起来不一样了吧？",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:70",
        "speaker": "阿禾",
        "text": "不过等会儿到布铺，怎么付，还得你自己定。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:71",
        "speaker": "阿禾",
        "text": "不急。出了这扇门，才算真正开始走这一趟。",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "prepare"
      },
      "sceneId": "P01_02_EXCHANGE_DONE",
      "terminal": true
    },
    "P01_02_EXCHANGE_INTRO": {
      "lines": [{
        "id": "v36:line:72",
        "speaker": "阿禾",
        "text": "瞧见这几张票了吗？纸薄薄的，做买卖却有人肯收。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:73",
        "speaker": "旁白",
        "text": "她拿起其中一张，顺着光看了看，又平平放回木案上。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:74",
        "speaker": "阿禾",
        "text": "不过啊，纸能省重量，不能省你该算的账。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:75",
        "speaker": "阿禾",
        "text": "存进去几份铁钱，扣一份兑换费用，剩下的给你交子。拿到手里的现钱少了，钱袋便轻了。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:76",
        "speaker": "阿禾",
        "text": "还有件事——沈娘子不是见着交子就全收。她铺里要留现钱，你可别一股脑全换光。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:77",
        "speaker": "旁白",
        "text": "她指指钱袋，又指指布铺的委托单，没替你选数字。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:78",
        "speaker": "阿禾",
        "text": "来，你自己拨。我在旁边看着。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "prepare",
        "wallet": true
      },
      "sceneId": "P01_02_EXCHANGE_INTRO",
      "terminal": true
    },
    "P01_03_ROAD_FORK__a": {
      "sceneId": "P01_03_ROAD_FORK",
      "lines": [{
        "id": "v36:line:84",
        "speaker": "阿禾",
        "text": "那你得先看一眼，桥钱留够没有。走起来可没法当它不存在。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_03_ROAD_FORK__1"
      }
    },
    "P01_03_ROAD_FORK__b": {
      "sceneId": "P01_03_ROAD_FORK",
      "lines": [{
        "id": "v36:line:85",
        "speaker": "阿禾",
        "text": "行，腿脚是自己的，钱也是自己的。走完了别说我没提醒巷子远。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_03_ROAD_FORK__1"
      }
    },
    "P01_03_ROAD_FORK__c": {
      "sceneId": "P01_03_ROAD_FORK",
      "lines": [{
        "id": "v36:line:86",
        "speaker": "阿禾",
        "text": "这就对了。知道两条路在哪儿，再挑喜欢的。",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_03_ROAD_FORK__1"
      }
    },
    "P01_03_ROAD_FORK": {
      "lines": [{
        "id": "v36:line:79",
        "speaker": "阿禾",
        "text": "现在说路。从仓门出去，往上过桥，能少绕一截。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:80",
        "speaker": "阿禾",
        "text": "可桥头收钱，只认铁钱。这规矩说久了，人人都习惯，外地来的未必知道。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:81",
        "speaker": "阿禾",
        "text": "从下边穿街巷，再拐进后巷，也能到沈家门口。不收桥钱，就是脚程长些。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:82",
        "speaker": "旁白",
        "text": "她蹲下，用树枝在地上划了两道线。一道短，一道弯，末尾都指向同一间布铺。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:83",
        "speaker": "阿禾",
        "text": "你看着选。我跟你走。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "先省脚程，早些回来。",
        "effects": {
          "chose_route_comment": "A"
        },
        "next": "P01_03_ROAD_FORK__a"
      }, {
        "id": "b",
        "label": "绕点路也行，能省则省。",
        "effects": {
          "chose_route_comment": "B"
        },
        "next": "P01_03_ROAD_FORK__b"
      }, {
        "id": "c",
        "label": "我先看地图，再作决定。",
        "effects": {
          "chose_route_comment": "C"
        },
        "next": "P01_03_ROAD_FORK__c"
      }],
      "done": {
        "next": "P01_03_ROAD_FORK__1"
      },
      "choiceId": "CHOICE_P01_ROUTE_OPINION",
      "sceneId": "P01_03_ROAD_FORK"
    },
    "P01_03_ROAD_FORK__1": {
      "lines": [{
        "id": "v36:line:87",
        "speaker": "旁白",
        "text": "阿禾收起树枝。真正要走哪条路，还在你手里。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "road"
      },
      "sceneId": "P01_03_ROAD_FORK",
      "terminal": true
    },
    "P01_04_BRIDGE": {
      "lines": [{
        "id": "v36:line:88",
        "speaker": "桥头收钱人",
        "text": "好，桥钱收了。过去吧。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:89",
        "speaker": "阿禾",
        "text": "早市过桥的人多，难怪这条路近。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:90",
        "speaker": "旁白",
        "text": "两辆运货的小车一前一后经过，车轮碾过桥石的声音比方才清楚。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:91",
        "speaker": "阿禾",
        "text": "有时候快一点是值当的，有时候不是。账算到最后才知道。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:92",
        "speaker": "桥头收钱人",
        "text": "你们慢些走，布铺那边刚有人来问今日的账。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:93",
        "speaker": "阿禾",
        "text": "沈娘子？她今早就派人来过了？",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:94",
        "speaker": "桥头收钱人",
        "text": "她手下的人。抱着一卷布，跑得比你还快。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:95",
        "speaker": "阿禾",
        "text": "知道了，多谢。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "road"
      },
      "sceneId": "P01_04_BRIDGE",
      "terminal": true
    },
    "P01_04_STREET__a": {
      "sceneId": "P01_04_STREET",
      "lines": [{
        "id": "v36:line:100",
        "speaker": "阿禾",
        "text": "比如知道哪家买饼会多送一口热水。你倒听得挺准。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_04_STREET__1"
      }
    },
    "P01_04_STREET__b": {
      "sceneId": "P01_04_STREET",
      "lines": [{
        "id": "v36:line:101",
        "speaker": "阿禾",
        "text": "是啊。哪些铺子今天开得早，哪家伙计脸色不对，隔天都有用。",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_04_STREET__1"
      }
    },
    "P01_04_STREET": {
      "lines": [{
        "id": "v36:line:96",
        "speaker": "旁白",
        "text": "这条路确实比桥远。才走出一段，便要替抬担的人让路。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:97",
        "speaker": "阿禾",
        "text": "闻到了吗？这家的饼出炉得早。每回赶不上早饭，我都在这里买。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:98",
        "speaker": "旁白",
        "text": "她嘴上提着饼，脚下却没停。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:99",
        "speaker": "阿禾",
        "text": "城里人总嫌绕路耽误事。可同一条巷子，走久了也有走久了的好处。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "比如知道哪里有早饭？",
        "effects": {},
        "next": "P01_04_STREET__a"
      }, {
        "id": "b",
        "label": "比如熟悉哪家的生意？",
        "effects": {},
        "next": "P01_04_STREET__b"
      }],
      "done": {
        "next": "P01_04_STREET__1"
      },
      "choiceId": "CHOICE_P01_STREET_SMALL",
      "sceneId": "P01_04_STREET"
    },
    "P01_04_STREET__1": {
      "lines": [{
        "id": "v36:line:102",
        "speaker": "旁白",
        "text": "巷口有人喊了一声「让让」，阿禾轻轻拉你退到墙边。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:103",
        "speaker": "阿禾",
        "text": "来，后巷在前头。再拐一道弯就近了。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "road"
      },
      "sceneId": "P01_04_STREET",
      "terminal": true
    },
    "P01_04_BACK_ALLEY__a": {
      "sceneId": "P01_04_BACK_ALLEY",
      "lines": [{
        "id": "v36:line:112",
        "speaker": "阿禾",
        "text": "嗯。她以前常去我娘那儿帮忙。后来来了沈家，手一直没闲过。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_04_BACK_ALLEY__1"
      }
    },
    "P01_04_BACK_ALLEY__b": {
      "sceneId": "P01_04_BACK_ALLEY",
      "lines": [{
        "id": "v36:line:113",
        "speaker": "阿禾",
        "text": "等着拿工钱的人，碰上要结账的日子，都着急。",
        "expression": "firm",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_04_BACK_ALLEY__1"
      }
    },
    "P01_04_BACK_ALLEY": {
      "lines": [{
        "id": "v36:line:104",
        "speaker": "织娘",
        "text": "啊，借过一下！这卷布得赶着送到前头。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:105",
        "speaker": "阿禾",
        "text": "阿杏？今日又是你送货？",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:106",
        "speaker": "织娘",
        "text": "沈娘子说账要赶在午后之前结完。布先送过去，账再慢慢对。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:107",
        "speaker": "阿禾",
        "text": "昨晚不是已经对了一回？",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:108",
        "speaker": "织娘",
        "text": "对货对好了，钱还得等铺里收上来呢。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:109",
        "speaker": "织娘",
        "text": "我先走了。阿禾，替我跟你娘问好。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:110",
        "speaker": "阿禾",
        "text": "好，你路上慢些。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:111",
        "speaker": "旁白",
        "text": "人走远后，阿禾低头理了理自己的钱袋绳结，动作比刚才慢了一点。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "你认识她？",
        "effects": {},
        "next": "P01_04_BACK_ALLEY__a"
      }, {
        "id": "b",
        "label": "她看着很着急。",
        "effects": {},
        "next": "P01_04_BACK_ALLEY__b"
      }],
      "done": {
        "next": "P01_04_BACK_ALLEY__1"
      },
      "choiceId": "CHOICE_P01_ALLEY_ASK",
      "sceneId": "P01_04_BACK_ALLEY"
    },
    "P01_04_BACK_ALLEY__1": {
      "lines": [{
        "id": "v36:line:114",
        "speaker": "阿禾",
        "text": "别被我耽误了。沈家就在前头，你一眼能认出来。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "road"
      },
      "sceneId": "P01_04_BACK_ALLEY",
      "terminal": true
    },
    "P01_05_SHEN_SHOP__a": {
      "sceneId": "P01_05_SHEN_SHOP",
      "lines": [{
        "id": "v36:line:123",
        "speaker": "沈娘子",
        "text": "你客气。东西交清楚，比嘴上会说话强。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_05_SHEN_SHOP__1"
      }
    },
    "P01_05_SHEN_SHOP__b": {
      "sceneId": "P01_05_SHEN_SHOP",
      "lines": [{
        "id": "v36:line:124",
        "speaker": "沈娘子",
        "text": "这样办事痛快。来，放这儿。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_05_SHEN_SHOP__1"
      }
    },
    "P01_05_SHEN_SHOP": {
      "lines": [{
        "id": "v36:line:115",
        "speaker": "沈娘子",
        "text": "这匹边上松了一线，先别往架子上放。拿回去叫人补两针。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:116",
        "speaker": "小伙计",
        "text": "可人家说午后就要来提。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:117",
        "speaker": "沈娘子",
        "text": "来提也得把东西交好。今早补得过来，急着上架做什么？",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:118",
        "speaker": "沈娘子",
        "text": "阿禾？你今天来得早。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:119",
        "speaker": "阿禾",
        "text": "带罗记的新行商来取布。掌柜叫我们别误了您这边的事。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:120",
        "speaker": "沈娘子",
        "text": "新人？",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:121",
        "speaker": "旁白",
        "text": "她打量了你一眼，视线从钱袋扫过，又落到你空着的两只手上。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:122",
        "speaker": "沈娘子",
        "text": "倒不像头一回来做买卖的模样。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "头一回独自来取货，若有不周到的地方，还请见谅。",
        "effects": {},
        "next": "P01_05_SHEN_SHOP__a"
      }, {
        "id": "b",
        "label": "我来取罗记订的布，先把单子给您看看。",
        "effects": {},
        "next": "P01_05_SHEN_SHOP__b"
      }],
      "done": {
        "next": "P01_05_SHEN_SHOP__1"
      },
      "choiceId": "CHOICE_P01_SHEN_GREETING",
      "sceneId": "P01_05_SHEN_SHOP"
    },
    "P01_05_SHEN_SHOP__1__a": {
      "sceneId": "P01_05_SHEN_SHOP",
      "lines": [{
        "id": "v36:line:144",
        "speaker": "沈娘子",
        "text": "因为今天要给人结的工钱，不全能拿票去抵。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:145",
        "speaker": "沈娘子",
        "text": "交子轻便，我收过，也用过。可轮到别人从我这里拿钱，总得先问问她们愿不愿意等。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:146",
        "speaker": "阿禾",
        "text": "那您不是不信交子。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:147",
        "speaker": "沈娘子",
        "text": "我只是不愿拿别人的日子赌方便。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_05_SHEN_SHOP__2"
      }
    },
    "P01_05_SHEN_SHOP__1__b": {
      "sceneId": "P01_05_SHEN_SHOP",
      "lines": [{
        "id": "v36:line:148",
        "speaker": "沈娘子",
        "text": "有些在铺后做，有些是熟识的织娘送来的。每个人手法不一样，时间久了，我摸摸边儿就知道谁做的。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:149",
        "speaker": "阿禾",
        "text": "您这双手可真比账房的算盘还准。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:150",
        "speaker": "沈娘子",
        "text": "准不准另说。做得好的货，给得起价，人才愿意接下一单。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_05_SHEN_SHOP__2"
      }
    },
    "P01_05_SHEN_SHOP__1__c": {
      "sceneId": "P01_05_SHEN_SHOP",
      "lines": [{
        "id": "v36:line:151",
        "speaker": "沈娘子",
        "text": "也好。单子写得清楚，我们就照单算。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_05_SHEN_SHOP__2"
      }
    },
    "P01_05_SHEN_SHOP__1": {
      "lines": [{
        "id": "v36:line:125",
        "speaker": "沈娘子",
        "text": "货是留着的。昨晚我还叫人检查过针脚，没发现缺处。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:126",
        "speaker": "阿禾",
        "text": "早晨巷里遇见阿杏了，她抱着布跑得飞快。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:127",
        "speaker": "沈娘子",
        "text": "又是她。跟她说了多少遍，急也别乱跑。绊倒了，人比布难补。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:128",
        "speaker": "阿禾",
        "text": "我说了。她让我替她问您一声，昨儿那笔工钱结好没有。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:129",
        "speaker": "沈娘子",
        "text": "账对好了，钱还没全收上来。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:130",
        "speaker": "阿禾",
        "text": "罗掌柜这边的布款带来了。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:131",
        "speaker": "沈娘子",
        "text": "那好。六份货钱，至少两份铁钱，其余可以用交子。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:132",
        "speaker": "旁白",
        "text": "她说得像在报布长布宽，没有一丝要同谁争执的意思。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:133",
        "speaker": "阿禾",
        "text": "您以前也收过整份的交子呀。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:134",
        "speaker": "沈娘子",
        "text": "以前是以前。收进柜里的票，和今日要付出去的钱，不是一回事。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:135",
        "speaker": "阿禾",
        "text": "怕是还要找人去兑。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:136",
        "speaker": "沈娘子",
        "text": "去兑得等，得查，还得看人家今日肯给多少。我这儿可不能叫几个做工的人等到天黑。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:137",
        "speaker": "旁白",
        "text": "她把一小卷补过边的布摊在桌上。针脚并不惹眼，细看却整齐得很。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:138",
        "speaker": "沈娘子",
        "text": "你看这处。昨夜阿杏补的。她家里还有老人要照料，今天收了工钱才好去买药。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:139",
        "speaker": "阿禾",
        "text": "她从小就这样。手上活急，嘴里也从不说一声累。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:140",
        "speaker": "沈娘子",
        "text": "我是开铺子的。布好不好，货对不对，我都要担着。人家把活做完了，工钱也得给明白。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "您为什么一定要收两份铁钱？",
        "effects": {
          "asked_shen_cash": true
        },
        "next": "P01_05_SHEN_SHOP__1__a"
      }, {
        "id": "b",
        "label": "这些布是你们自己织的？",
        "effects": {},
        "next": "P01_05_SHEN_SHOP__1__b"
      }, {
        "id": "c",
        "label": "我先按单子把货取了。",
        "effects": {},
        "next": "P01_05_SHEN_SHOP__1__c"
      }],
      "done": {
        "next": "P01_05_SHEN_SHOP__2"
      },
      "choiceId": "CHOICE_P01_SHEN_REASON",
      "sceneId": "P01_05_SHEN_SHOP"
    },
    "P01_05_SHEN_SHOP__2": {
      "lines": [{
        "id": "v36:line:152",
        "speaker": "沈娘子",
        "text": "先不忙搬。你把钱放到这边，我核过账，再将布交给你。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:153",
        "speaker": "阿禾",
        "text": "我在旁边等着。该怎么付，这回你自己做主。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "payment",
        "flags": {
          "clothSelected": true
        }
      },
      "sceneId": "P01_05_SHEN_SHOP",
      "terminal": true
    },
    "P01_06_BOUGHT__a": {
      "sceneId": "P01_06_BOUGHT",
      "lines": [{
        "id": "v36:line:167",
        "speaker": "沈娘子",
        "text": "哪张？哦，那是压着的旧票。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:168",
        "speaker": "沈娘子",
        "text": "老往来的记认。时间久了，谁经手的、哪张对哪笔账，不看这些还真不好找。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:169",
        "speaker": "阿禾",
        "text": "沈家和罗记的旧账？",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:170",
        "speaker": "沈娘子",
        "text": "算谁家的，还得看账册。别光凭一角颜色就认定什么。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:171",
        "speaker": "沈娘子",
        "text": "何况印在纸上的东西，终归要有人肯照着办。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:172",
        "speaker": "旁白",
        "text": "她把账匣轻轻合上，没再追着这个话题说。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_06_BOUGHT__1"
      }
    },
    "P01_06_BOUGHT__b": {
      "sceneId": "P01_06_BOUGHT",
      "lines": [{
        "id": "v36:line:173",
        "speaker": "旁白",
        "text": "你收回视线，没有贸然开口。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:174",
        "speaker": "阿禾",
        "text": "你刚才像是看见什么了。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:175",
        "speaker": "旁白",
        "text": "你摇摇头，先将布卷重新抱稳。阿禾没有再问。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:176",
        "speaker": "沈娘子",
        "text": "该交的货已经交了。你们赶在日头偏西前送回去吧。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_06_BOUGHT__1"
      }
    },
    "P01_06_BOUGHT": {
      "lines": [{
        "id": "v36:line:154",
        "speaker": "沈娘子",
        "text": "数目对了。这布交给你。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:155",
        "speaker": "旁白",
        "text": "布卷落到怀里，并不轻。方才钱袋里腾出来的地方，此刻也有了用处。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:156",
        "speaker": "阿禾",
        "text": "沈娘子这回总能安心些了吧？",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:157",
        "speaker": "沈娘子",
        "text": "安心倒未必。等人拿了工钱回去，我才能少操些心。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:158",
        "speaker": "阿禾",
        "text": "阿杏他们今早真忙。刚才巷子里还见她抱着布跑。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:159",
        "speaker": "沈娘子",
        "text": "那孩子手脚快，偏偏最怕误事。上回一根针落地上，她自己找了半个时辰。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:160",
        "speaker": "阿禾",
        "text": "找到了？",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:161",
        "speaker": "沈娘子",
        "text": "找到了。就在她自己衣襟上，叫线头挂着。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:162",
        "speaker": "沈娘子",
        "text": "布拿稳了。遇水就裹严些，别叫罗掌柜回头说我交了湿货。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:163",
        "speaker": "阿禾",
        "text": "他不敢。真要是我们淋湿的，我替您作证。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:164",
        "speaker": "旁白",
        "text": "你原本只是在等绳结系好，却瞥见账匣里一张旧纸。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:165",
        "speaker": "旁白",
        "text": "纸角有道红色押记。颜色浅了些，形状却让你想起罗记前堂那本账簿。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:166",
        "speaker": "阿禾",
        "text": "怎么了？",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "问问沈娘子，这记号是什么。",
        "effects": {
          "asked_shen_mark": true
        },
        "next": "P01_06_BOUGHT__a"
      }, {
        "id": "b",
        "label": "记住这个记号，不在此处追问。",
        "effects": {
          "asked_shen_mark": false
        },
        "next": "P01_06_BOUGHT__b"
      }],
      "done": {
        "next": "P01_06_BOUGHT__1"
      },
      "choiceId": "CHOICE_P01_RED_MARK",
      "sceneId": "P01_06_BOUGHT"
    },
    "P01_06_BOUGHT__1": {
      "lines": [{
        "id": "v36:line:177",
        "speaker": "沈娘子",
        "text": "还有，替我给罗掌柜带个话。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:178",
        "speaker": "阿禾",
        "text": "您说。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:179",
        "speaker": "沈娘子",
        "text": "下回再用交子结布款，先把能当日给的现钱写在单上。别等到了柜前再说「照旧」。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:180",
        "speaker": "阿禾",
        "text": "我记下了。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:181",
        "speaker": "沈娘子",
        "text": "我不是不做他的生意。做得久了，才更要把话提前讲明白。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:182",
        "speaker": "旁白",
        "text": "店里有人唤沈娘子去看另一匹布。她应了一声，又转回忙碌的柜台。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:183",
        "speaker": "阿禾",
        "text": "她总是这样。一句话能交代的事，不爱留到第二天。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "return"
      },
      "sceneId": "P01_06_BOUGHT",
      "terminal": true
    },
    "P01_07_DELIVERY_APPROACH__a": {
      "sceneId": "P01_07_DELIVERY_APPROACH",
      "lines": [{
        "id": "v36:line:187",
        "speaker": "阿禾",
        "text": "是。熟归熟，东西是新的，账就得重新对。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_07_DELIVERY_APPROACH__1"
      }
    },
    "P01_07_DELIVERY_APPROACH__b": {
      "sceneId": "P01_07_DELIVERY_APPROACH",
      "lines": [{
        "id": "v36:line:188",
        "speaker": "阿禾",
        "text": "嗯。铺里收了什么，不等于她们当天就能拿到什么。",
        "expression": "firm",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_07_DELIVERY_APPROACH__1"
      }
    },
    "P01_07_DELIVERY_APPROACH": {
      "lines": [{
        "id": "v36:line:185",
        "speaker": "阿禾（气泡）",
        "text": "布收好了。前面就是商行交付处，咱们走吧。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:186",
        "speaker": "阿禾",
        "text": "沈娘子说的「照旧」，你听明白了吗？",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "熟人做生意，也要把这次的条件说清楚。",
        "effects": {},
        "next": "P01_07_DELIVERY_APPROACH__a"
      }, {
        "id": "b",
        "label": "她是在替铺里做工的人着想。",
        "effects": {},
        "next": "P01_07_DELIVERY_APPROACH__b"
      }],
      "done": {
        "next": "P01_07_DELIVERY_APPROACH__1"
      },
      "choiceId": "CHOICE_P01_WAY_BACK",
      "sceneId": "P01_07_DELIVERY_APPROACH"
    },
    "P01_07_DELIVERY_APPROACH__1": {
      "lines": [{
        "id": "v36:line:189",
        "speaker": "阿禾",
        "text": "得，先交了布，再说这一路的事。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [],
      "done": {},
      "sceneId": "P01_07_DELIVERY_APPROACH",
      "terminal": true
    },
    "P01_08_DELIVERED": {
      "lines": [{
        "id": "v36:line:190",
        "speaker": "罗掌柜",
        "text": "回来了？布呢？",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:191",
        "speaker": "旁白",
        "text": "你将布卷交上去。罗掌柜解开布绳，先看了料色，又翻看两侧收好的边。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:192",
        "speaker": "罗掌柜",
        "text": "针脚细，没沾水。沈娘子办事一向仔细。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:193",
        "speaker": "阿禾",
        "text": "她还让您把下回的货款条件写清楚，别临到柜台才说「照旧」。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:194",
        "speaker": "罗掌柜",
        "text": "这话她说得有理。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:195",
        "speaker": "罗掌柜",
        "text": "从桥上走的？",
        "expression": "thinking",
        "pose": "idle",
        "route": "bridge"
      }, {
        "id": "v36:line:196",
        "speaker": "阿禾",
        "text": "嗯。省了一段脚程，桥钱倒是照付了。",
        "expression": "neutral",
        "pose": "idle",
        "route": "bridge"
      }, {
        "id": "v36:line:197",
        "speaker": "罗掌柜",
        "text": "快与省，哪样合适得看差事。今日准时回来便成。",
        "expression": "neutral",
        "pose": "idle",
        "route": "bridge"
      }, {
        "id": "v36:line:198",
        "speaker": "罗掌柜",
        "text": "绕了街巷？",
        "expression": "thinking",
        "pose": "idle",
        "route": "alley"
      }, {
        "id": "v36:line:199",
        "speaker": "阿禾",
        "text": "多走了一段，把桥钱省下了。只是阿杏差点在后巷撞上我们。",
        "expression": "smile",
        "pose": "idle",
        "route": "alley"
      }, {
        "id": "v36:line:200",
        "speaker": "罗掌柜",
        "text": "她们也忙。路长些，货没误就好。",
        "expression": "neutral",
        "pose": "idle",
        "route": "alley"
      }, {
        "id": "v36:line:201",
        "speaker": "罗掌柜",
        "text": "你这一趟，钱和路都算过了。头一次接差事，能把货稳稳送回，比什么都实在。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:202",
        "speaker": "旁白",
        "text": "他一边说，一边将收货数目记上账，笔尖在纸上沙沙作响。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:203",
        "speaker": "阿禾",
        "text": "沈娘子今早还说，她铺里有人等着结工钱。往后您若要拿交子付整笔货款，最好早些告诉她。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:204",
        "speaker": "罗掌柜",
        "text": "她现在要求一部分现钱，我知道。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:205",
        "speaker": "阿禾",
        "text": "知道归知道，下回可别叫我们到柜上才发现话没谈妥。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:206",
        "speaker": "罗掌柜",
        "text": "阿禾，去把这匹布入仓。让新来的把今日的路和花费记一下。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:207",
        "speaker": "阿禾",
        "text": "掌柜，您还没答我。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:208",
        "speaker": "罗掌柜",
        "text": "你说的我记下了。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:209",
        "speaker": "旁白",
        "text": "他的声音不重，却明显不想在此时说得更多。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "record",
        "next": "P01_09_LEDGER"
      },
      "sceneId": "P01_08_DELIVERED",
      "terminal": true
    },
    "P01_09_LEDGER__a": {
      "sceneId": "P01_09_LEDGER",
      "lines": [{
        "id": "v36:line:216",
        "speaker": "罗掌柜",
        "text": "你连这个都看见了？",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:217",
        "speaker": "罗掌柜",
        "text": "是前些年的往来记认。有些票转过几手，凭一个记号还说不清哪笔是谁欠谁的。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:218",
        "speaker": "阿禾",
        "text": "那不更该早些对清？",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:219",
        "speaker": "罗掌柜",
        "text": "该对，我自会对。但账有原委，不是把纸摊开就能立刻理明白的。",
        "expression": "worried",
        "pose": "idle"
      }, {
        "id": "v36:line:220",
        "speaker": "旁白",
        "text": "他把那张旧票折回账页，指尖在折痕上按了一下。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_09_LEDGER__1"
      }
    },
    "P01_09_LEDGER__b": {
      "sceneId": "P01_09_LEDGER",
      "lines": [{
        "id": "v36:line:221",
        "speaker": "旁白",
        "text": "你没有追问。罗掌柜重新合上账本，像是终于松了一口气。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:222",
        "speaker": "阿禾",
        "text": "……算了，先记今日的吧。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:223",
        "speaker": "罗掌柜",
        "text": "嗯。下回等我把账理出头绪，再和你们细说。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_09_LEDGER__1"
      }
    },
    "P01_09_LEDGER": {
      "lines": [{
        "id": "v36:line:210",
        "speaker": "旁白",
        "text": "罗掌柜将账簿翻到后几页，又折回前头，像是在找一笔有些日子没动的账。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:211",
        "speaker": "阿禾",
        "text": "掌柜，沈家和许记是不是还有往来？",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:212",
        "speaker": "罗掌柜",
        "text": "你从哪儿听来的？",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:213",
        "speaker": "阿禾",
        "text": "我没听谁说。只是这阵子收票的规矩变得快。若是旧账还没清，我们得先知道下回能怎么收。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:214",
        "speaker": "罗掌柜",
        "text": "生意做久了，总有几笔没对齐的。你们今日那张单子，我已经记好了。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:215",
        "speaker": "阿禾",
        "text": "我说的不是今日这一张。",
        "expression": "firm",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "沈家柜里也有带红记的旧票，那是什么？",
        "effects": {
          "asked_luo_old_account": true
        },
        "next": "P01_09_LEDGER__a"
      }, {
        "id": "b",
        "label": "今日的委托办完了，旧账留待日后再问。",
        "effects": {
          "asked_luo_old_account": false
        },
        "next": "P01_09_LEDGER__b"
      }],
      "done": {
        "next": "P01_09_LEDGER__1"
      },
      "choiceId": "CHOICE_P01_LUO_LEDGER",
      "sceneId": "P01_09_LEDGER"
    },
    "P01_09_LEDGER__1": {
      "lines": [{
        "id": "v36:line:224",
        "speaker": "罗掌柜",
        "text": "明日有两笔差事，一笔粮，一笔药。两家收钱的规矩也不一样。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:225",
        "speaker": "阿禾",
        "text": "您才让人跑完第一趟，就惦记上第二趟了。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:226",
        "speaker": "罗掌柜",
        "text": "今日没出错，明日自然还能交给他做。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:227",
        "speaker": "阿禾",
        "text": "那明日我带路，至少让他别在街巷里找错铺子。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:228",
        "speaker": "罗掌柜",
        "text": "你今日不也说过，叫新人自己认路？",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:229",
        "speaker": "阿禾",
        "text": "我说归我说，真要走错了，您还不是得叫我去找。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:230",
        "speaker": "罗掌柜",
        "text": "好了，去吃饭吧。没看见你们饿得连吵嘴都没力气了么。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "ending",
        "next": "P01_10_AFTER_MARKET"
      },
      "sceneId": "P01_09_LEDGER",
      "terminal": true
    },
    "P01_10_AFTER_MARKET__a": {
      "sceneId": "P01_10_AFTER_MARKET",
      "lines": [{
        "id": "v36:line:235",
        "speaker": "阿禾",
        "text": "我习惯了。城里这些路，一天来回几趟，也不觉得多远。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:236",
        "speaker": "阿禾",
        "text": "倒是见着沈娘子时，想起好些旧事。",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_10_AFTER_MARKET__1"
      }
    },
    "P01_10_AFTER_MARKET__b": {
      "sceneId": "P01_10_AFTER_MARKET",
      "lines": [{
        "id": "v36:line:237",
        "speaker": "阿禾",
        "text": "嗯。她这个人不肯随口应下自己做不到的事。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:238",
        "speaker": "阿禾",
        "text": "有人等着拿钱回家时，这脾气算不上坏。",
        "expression": "firm",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_10_AFTER_MARKET__1"
      }
    },
    "P01_10_AFTER_MARKET__c": {
      "sceneId": "P01_10_AFTER_MARKET",
      "lines": [{
        "id": "v36:line:239",
        "speaker": "阿禾",
        "text": "那倒不必。下回认不认得，全看你自己了。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:240",
        "speaker": "阿禾",
        "text": "不过，下回真走不明白，还是可以问我。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "next": "P01_10_AFTER_MARKET__1"
      }
    },
    "P01_10_AFTER_MARKET": {
      "lines": [{
        "id": "v36:line:231",
        "speaker": "旁白",
        "text": "待你从前堂出来，街边的叫卖声已稀了。门口那捆细绳仍在，却被人码得好好的。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:232",
        "speaker": "阿禾",
        "text": "还没回去？",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:233",
        "speaker": "旁白",
        "text": "她正蹲在门槛边，给自己的钱袋重新穿绳。见你出来，便往旁边挪出半个人坐的位置。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:234",
        "speaker": "阿禾",
        "text": "今日没把你弄丢，也没让你把货丢了。这样算来，我这半天不亏。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [{
        "id": "a",
        "label": "你看起来比我还累。",
        "effects": {},
        "next": "P01_10_AFTER_MARKET__a"
      }, {
        "id": "b",
        "label": "你似乎很在意沈娘子收钱的规矩。",
        "effects": {},
        "next": "P01_10_AFTER_MARKET__b"
      }, {
        "id": "c",
        "label": "今天谢谢你替我认路。",
        "effects": {},
        "next": "P01_10_AFTER_MARKET__c"
      }],
      "done": {
        "next": "P01_10_AFTER_MARKET__1"
      },
      "choiceId": "CHOICE_P01_AHE_EVENING",
      "sceneId": "P01_10_AFTER_MARKET"
    },
    "P01_10_AFTER_MARKET__1": {
      "lines": [{
        "id": "v36:line:241",
        "speaker": "阿禾",
        "text": "我小时候跟我娘去铺子里送布，最讨厌听大人讲账。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:242",
        "speaker": "阿禾",
        "text": "他们说得慢，一笔又一笔，半天也说不完。我只想着早点出去玩。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:243",
        "speaker": "阿禾",
        "text": "后来才知道，账若是迟一天，人就得跟着多等一天。",
        "expression": "thinking",
        "pose": "idle"
      }, {
        "id": "v36:line:244",
        "speaker": "旁白",
        "text": "她说完看向对街。灯火一盏接一盏亮起来，尚有铺子没有收工。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:245",
        "speaker": "阿禾",
        "text": "我不是说纸票不好。要是事事都背铁钱，谁还肯跑那么远的路做生意。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:246",
        "speaker": "阿禾",
        "text": "只是有人说「明日给」，听的人得想清楚，自己等不等得起。",
        "expression": "firm",
        "pose": "idle"
      }, {
        "id": "v36:line:247",
        "speaker": "阿禾",
        "text": "行了，今日算你头一趟见世面。明日可没有人替你反复提醒桥钱。",
        "expression": "smile",
        "pose": "idle"
      }, {
        "id": "v36:line:248",
        "speaker": "旁白",
        "text": "她站起来，抖去衣角一点灰，把门边的灯往里侧拨了拨。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:249",
        "speaker": "阿禾",
        "text": "明早见。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:250",
        "speaker": "旁白",
        "text": "你往街口走了几步，回头时，看见罗记前堂的灯仍亮着。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:251",
        "speaker": "旁白",
        "text": "罗掌柜还在柜后翻账。隔着窗纸，能看见他的手停了一会儿，又慢慢落笔。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:252",
        "speaker": "旁白",
        "text": "今天不过是一份布的买卖。你却记住了几个人说起「结账」时，不大一样的神情。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "phase": "settled",
        "flags": {
          "endingSeen": true
        },
        "complete": true
      },
      "sceneId": "P01_10_AFTER_MARKET",
      "terminal": true
    },
    "P00_01_GATE:HOTSPOT_SIGN": {
      "sceneId": "P00_01_GATE",
      "lines": [{
        "id": "v36:line:9",
        "speaker": "旁白",
        "text": "木牌边缘有些磨损，两个字却描得清楚。有人来去频繁，门槛被踩得发亮。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:10",
        "speaker": "旁白",
        "text": "你摸了摸怀里的介绍字条。地址没错。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {},
      "terminal": true
    },
    "P00_01_GATE:HOTSPOT_CRATES": {
      "sceneId": "P00_01_GATE",
      "lines": [{
        "id": "v36:line:11",
        "speaker": "旁白",
        "text": "箱上用墨写着货主名和交收日子，有两处字被改过，旁边又添了一枚小小的记号。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:12",
        "speaker": "路过伙计",
        "text": "别踩着那箱，午后还要送回沈家去呢。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {},
      "terminal": true
    },
    "P00_01_GATE:HOTSPOT_ROAD": {
      "sceneId": "P00_01_GATE",
      "lines": [{
        "id": "v36:line:13",
        "speaker": "旁白",
        "text": "脚夫正同过路人商量换肩，没人有空停下来讲一整段城里的故事。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {},
      "terminal": true
    },
    "P00_04_FRONT_DESK:HOTSPOT_ORDER": {
      "sceneId": "P00_04_FRONT_DESK",
      "lines": [{
        "id": "v36:line:48",
        "speaker": "旁白",
        "text": "「沈家布铺，布一份，价六，午后交收。」最末写着罗记的名字，笔画干净。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:49",
        "speaker": "阿禾",
        "text": "这就是要办的事。货取回来，交给商行的人便成。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {},
      "terminal": true
    },
    "P00_04_FRONT_DESK:HOTSPOT_SAMPLE": {
      "sceneId": "P00_04_FRONT_DESK",
      "lines": [{
        "id": "v36:line:50",
        "speaker": "旁白",
        "text": "布面摸起来平整，针脚收得细。边缘有几处不同的线头，像出自两个人的手。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:51",
        "speaker": "阿禾",
        "text": "沈娘子挑货眼睛厉害。你若想拿次货糊弄她，她不用拆开就能瞧出来。",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [],
      "done": {},
      "terminal": true
    },
    "P00_04_FRONT_DESK:HOTSPOT_LEDGER": {
      "sceneId": "P00_04_FRONT_DESK",
      "lines": [{
        "id": "v36:line:52",
        "speaker": "旁白",
        "text": "账本扣着，底下压了一角旧票。朱红不是新印上去的，纸折处颜色有些淡了。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:53",
        "speaker": "罗掌柜",
        "text": "要查今日委托，看上头那张单子就成。旧账我晚些自己理。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:54",
        "speaker": "旁白",
        "text": "他没有责怪你，只把账簿往自己那边挪了挪。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "flags": {
          "noticed_red_mark_at_luo": "investigated"
        }
      },
      "terminal": true
    },
    "P01_01_WAREHOUSE:HOTSPOT_IRON_TRAY": {
      "sceneId": "P01_01_WAREHOUSE",
      "lines": [{
        "id": "v36:line:63",
        "speaker": "旁白",
        "text": "八份铁钱，一份不少。每一份都算货款，重量却也实实在在。",
        "expression": "neutral",
        "pose": "idle"
      }],
      "choices": [],
      "done": {},
      "terminal": true
    },
    "P01_01_WAREHOUSE:HOTSPOT_BAG": {
      "sceneId": "P01_01_WAREHOUSE",
      "lines": [{
        "id": "v36:line:64",
        "speaker": "旁白",
        "text": "这只钱袋最多只能带五格重量。铁钱每份占一格，交子却几乎不占位置。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:65",
        "speaker": "阿禾",
        "text": "布取回来也占地方。还没出门就塞满了，可不是好主意。",
        "expression": "firm",
        "pose": "idle"
      }],
      "choices": [],
      "done": {},
      "terminal": true
    },
    "P01_01_WAREHOUSE:HOTSPOT_EXCHANGE_DESK": {
      "sceneId": "P01_01_WAREHOUSE",
      "lines": [{
        "id": "v36:line:66",
        "speaker": "旁白",
        "text": "小桌上压着几张印有商号记认的票据，旁边摆着收钱用的木盒。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:67",
        "speaker": "阿禾",
        "text": "这里可以把铁钱存进去，换成方便携带的交子。只是铺户也要收一份辛苦钱。",
        "expression": "thinking",
        "pose": "idle"
      }],
      "choices": [],
      "done": {},
      "terminal": true
    },
    "P01_05_SHEN_SHOP:HOTSPOT_CLOTH": {
      "sceneId": "P01_05_SHEN_SHOP",
      "lines": [{
        "id": "v36:line:141",
        "speaker": "旁白",
        "text": "布料铺在长案上，边角收得利落。浅色布面经光一照，能看清纵横交错的细线。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:142",
        "speaker": "沈娘子",
        "text": "这份若哪里有问题，拿回来说，别等交了货才想起没验过。",
        "expression": "neutral",
        "pose": "idle"
      }, {
        "id": "v36:line:143",
        "speaker": "阿禾",
        "text": "沈娘子就是这样。自己家的布，先替别人挑一遍毛病。",
        "expression": "smile",
        "pose": "idle"
      }],
      "choices": [],
      "done": {
        "flags": {
          "inspected_cloth": true
        }
      },
      "terminal": true
    }
  };
});