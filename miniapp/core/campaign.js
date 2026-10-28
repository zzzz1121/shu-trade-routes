(function (r, f) {
  if (typeof module === 'object' && module.exports) module.exports = f(require('./campaign-script'));else r.ShuCampaign = f(r.ShuCampaignScript);
})(this, function (Script) {
  'use strict';

  const sources = [{
    name: '成都博物馆：看展丨“钱眼”看成都',
    url: 'https://www.cdmuseum.com/xinwen/202204/2721.html'
  }, {
    name: '何平：交子产生的信任机制与官方交子的历史意义',
    url: 'https://www.nopss.gov.cn/n1/2023/0911/c219544-40075019.html'
  }];
  const chapters = {
    l02: {
      prefix: 'C2',
      opening: 'C2_OPEN',
      ending: 'C2_DELIVER',
      investigations: [['BAGS', '旧粮袋'], ['PAPERS', '两张货单']],
      arrivals: {
        grain_shop: 'C2_GRAIN',
        medicine_shop: 'C2_MEDICINE',
        side_street: 'C2_SIDE'
      },
      trades: {
        'buy-grain': 'C2_GRAIN_DONE',
        'buy-medicine': 'C2_MED_DONE'
      },
      names: {
        grain_shop: '陈家粮铺',
        medicine_shop: '闵家药铺'
      },
      clues: ['receipt-not-cash'],
      closing: '两笔货清了，一笔旧账刚露出头。',
      history: [['纸券和现钱并行', '纸券方便大宗往来，并不意味着铁钱退出日常交易。不同交易有不同需要。游戏中粮、药铺的最低付款比例是策略设计，不是宋代统一规定。'], ['记录能证明什么', '本章用收票与付现的差别制造调查。陈伯、闵娘子与那张交接副页均属虚构，不是历史个案或古代账簿格式的复原。']]
    },
    l03: {
      prefix: 'C3',
      opening: 'C3_OPEN',
      ending: 'C3_DELIVER',
      investigations: [['TICKET', '今日票面'], ['DATE', '日期窄纸']],
      arrivals: {
        east_market: 'C3_EAST',
        exchange: 'C3_EXCHANGE',
        west_market: 'C3_WEST'
      },
      trades: {
        'swap-notes': 'C3_SWAP_DONE',
        'buy-east': 'C3_BUY_DONE',
        'buy-west': 'C3_BUY_DONE'
      },
      names: {
        east_market: '沈家东市柜',
        exchange: '许记换票铺',
        west_market: '西市布柜'
      },
      clues: ['mother-arrears', 'pending-slip'],
      closing: '纸上的记号接上了，等钱的人终于有了名字。',
      history: [['民间铺户与信任', '早期交子与民间铺户及其信用关系有关，后来发展出联合经营的形式。接受纸券需要相应的信用与兑付基础，不能简单理解为一张纸天然有价值。'], ['虚构商号与红记', '游戏甲、乙号票与四换三的比例均为虚构。史料提到朱墨、押字等记认，本案红记及具体流转过程不是出土票面或真实争讼的复原。']]
    },
    l04: {
      prefix: 'C4',
      opening: 'C4_OPEN',
      ending: 'C4_DELIVER',
      investigations: [['WRAPPING', '茶包折角'], ['LEDGER', '经手抄页']],
      arrivals: {
        tea_shop: 'C4_TEA',
        toll_crossing: 'C4_TOLL',
        street: 'C4_STREET',
        back_alley: 'C4_ALLEY',
        cloth_shop: 'C4_CLOTH'
      },
      trades: {
        'sell-tea': 'C4_SELL_DONE',
        'buy-cloth': 'C4_BUY_DONE'
      },
      names: {
        tea_shop: '茶行',
        cloth_shop: '沈家布坊'
      },
      clues: ['unpaid-transfer', 'luo-admission'],
      closing: '“未领钱”三个字，终于有人亲口认了。',
      history: [['茶货与纸券', '蜀地茶业及远距离、大额交易，是理解交子使用背景的一部分。纸券减轻携钱负担，但不能据此断言某位茶商单独发明了交子。'], ['周转不是清偿', '本章的卖茶、渡口费和转兑纸均为虚构。卖货收到票券与持票兑出金属钱是不同环节；具体权利义务不能直接拿游戏规则解释历史。']]
    },
    l05: {
      prefix: 'C5',
      opening: 'C5_OPEN',
      ending: 'C5_DELIVER',
      investigations: [['QUEUE', '队尾笔记'], ['EVIDENCE', '三只纸夹']],
      arrivals: {
        east_market: 'C5_EAST',
        xu_exchange: 'C5_XU',
        west_market: 'C5_WEST'
      },
      trades: {
        'redeem-notes': 'C5_REDEEM_DONE',
        'buy-east': 'C5_BUY_DONE',
        'buy-west': 'C5_BUY_DONE'
      },
      names: {
        xu_exchange: '许记兑付柜',
        east_market: '东市纸铺',
        west_market: '西市纸铺'
      },
      clues: ['arrears-confirmed', 'repayment-agreement'],
      closing: '不是把欠款说没了，而是把谁来还写清了。',
      history: [['兑付与信任', '研究及史料记录早期铺户遭遇兑付困难、索钱与争讼。纸券能流转，并不能消除持有人同时索取现钱时的风险。'], ['本案不是真实判例', '本章排队、三份限额、核账与分期安排为虚构。剧情不代表所有铺户都欺诈，也不把一份欠款协议当成宋代司法制度的标准程序。']]
    },
    l06: {
      prefix: 'C6',
      opening: 'C6_OPEN',
      ending: 'C6_DELIVER',
      investigations: [['NEW_PAPER', '新旧纸券'], ['OLD_KNOT', '钱袋绳结']],
      arrivals: {
        toll_bridge: 'C6_BRIDGE',
        street: 'C6_STREET',
        back_alley: 'C6_ALLEY',
        cloth_shop: 'C6_CLOTH',
        tea_shop: 'C6_TEA'
      },
      trades: {
        'buy-cloth': 'C6_CLOTH_DONE',
        'buy-tea': 'C6_TEA_DONE'
      },
      names: {
        cloth_shop: '沈家布坊',
        tea_shop: '茶行'
      },
      clues: ['repayment-complete'],
      closing: '这一页可以合上。下回见，还在路上。',
      history: [['多年以后的新交子', '史料通常将天圣元年设益州交子务与天圣二年开始发行官交子区分叙述。本章明确跳到多年以后，不把前五章几日内的委托接成制度突然变更。'], ['新的发行主体', '官交子意味着发行管理发生变化，并非阿禾、罗记或玩家破案的成果。旧欠款也不因新制度自动消失，本故事用单独的清偿记录交代结局。']]
    }
  };
  function event(id, flags = {}) {
    const raw = Script[id];
    if (!raw) return null;
    const e = JSON.parse(JSON.stringify(raw));
    e.lines = e.lines.filter(l => {
      if (!l.condition) return true;
      const [k, v] = l.condition.split('=');
      return String(flags[k]) === v;
    });
    if (!e.lines.length) return null;
    return e;
  }
  function history(id) {
    return {
      sources,
      pages: chapters[id].history.map(([title, body]) => ({
        title,
        body
      }))
    };
  }
  return {
    chapters,
    Script,
    event,
    history,
    sources
  };
});